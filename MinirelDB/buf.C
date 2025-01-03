#include <memory.h>
#include <unistd.h>
#include <errno.h>
#include <stdlib.h>
#include <fcntl.h>
#include <iostream>
#include <stdio.h>
#include "page.h"
#include "buf.h"

#define ASSERT(c)                                              \
    {                                                          \
        if (!(c))                                              \
        {                                                      \
            cerr << "At line " << __LINE__ << ":" << endl      \
                 << "  ";                                      \
            cerr << "This condition should hold: " #c << endl; \
            exit(1);                                           \
        }                                                      \
    }

//----------------------------------------
// Constructor of the class BufMgr
//----------------------------------------

BufMgr::BufMgr(const int bufs)
{
    numBufs = bufs;

    bufTable = new BufDesc[bufs];
    memset(bufTable, 0, bufs * sizeof(BufDesc));
    for (int i = 0; i < bufs; i++)
    {
        bufTable[i].frameNo = i;
        bufTable[i].valid = false;
    }

    bufPool = new Page[bufs];
    memset(bufPool, 0, bufs * sizeof(Page));

    int htsize = ((((int)(bufs * 1.2)) * 2) / 2) + 1;
    hashTable = new BufHashTbl(htsize); // allocate the buffer hash table

    clockHand = bufs - 1;
}

BufMgr::~BufMgr()
{

    // flush out all unwritten pages
    for (int i = 0; i < numBufs; i++)
    {
        BufDesc *tmpbuf = &bufTable[i];
        if (tmpbuf->valid == true && tmpbuf->dirty == true)
        {

#ifdef DEBUGBUF
            cout << "flushing page " << tmpbuf->pageNo
                 << " from frame " << i << endl;
#endif

            tmpbuf->file->writePage(tmpbuf->pageNo, &(bufPool[i]));
        }
    }

    delete[] bufTable;
    delete[] bufPool;
}

/**
 * @brief Allocates a free frame using the clock algorithm; if necessary, writing a dirty page back to disk.
 *
 * @param frame free frame that will be allocated later
 * @return Returns BUFFEREXCEEDED if all buffer frames are pinned, UNIXERR if the call to the I/O layer returned an error when a dirty page was being written to disk and OK otherwise.
 */
const Status BufMgr::allocBuf(int &frame)
{
    int count = 0; // the count of checking time
    while (count < 2 * numBufs)
    { // try to loop it twice to avoid any accidents and the infinite loop
        advanceClock();
        if (bufTable[clockHand].valid) // check whether the slot is valid or not
        {
            if (bufTable[clockHand].pinCnt != 0) // if someone is using it, then skip
            {
                count++;
                continue;
            }
            else
            {
                if (bufTable[clockHand].refbit) // if no one is using it and rebit is true
                {
                    bufTable[clockHand].refbit = false;
                    count++;
                    continue;
                }
                else
                {
                    if (bufTable[clockHand].dirty)
                    {
                        Status status = bufTable[clockHand].file->writePage(bufTable[clockHand].pageNo, &bufPool[clockHand]); // write back the dirty page
                        if (status != OK)
                        {
                            return UNIXERR;
                        }
                        else
                        { // update the bufStats if it is a dirty page
                            bufStats.diskwrites++;
                        }
                    }
                    // update some info for dirty page or clean page
                    frame = clockHand;
                    hashTable->remove(bufTable[clockHand].file, bufTable[clockHand].pageNo);
                    bufTable[clockHand].Clear();
                    return OK;
                }
            }
        }
        else
        { // if the page is not valid, then you can directly replace it
            frame = clockHand;
            bufTable[clockHand].Clear();
            return OK;
        }
        count++;
    }
    return BUFFEREXCEEDED;
}

/**
 * @brief read the page from the bufferpool. If it doesn't in the bp, then read the page from Disk and move it to the bp. (read from disk + allocation) Return the page's pointer if found.
 * @return Returns BUFFEREXCEEDED, UNIXERR (from allocBuf), HASHTBLERROR (from insertion in hashtable), BADPAGEPTR,BADPAGENO (from readPage in file), or OK (no errors)
 */
const Status BufMgr::readPage(File *file, const int PageNo, Page *&page)
{   
    
    Status status;
    Status allocStatus;
    Status readPageStatus;
    Status insertToHash;
    int frameNum;
    int freeFrameNum;

    status = hashTable->lookup(file,PageNo,frameNum);
    //case 1: Page is not in the buffer pool
    if(status == HASHNOTFOUND){
        //allocate a buffer frame
        allocStatus = allocBuf(freeFrameNum);
        // successfully allocated a new frame for the page
        if(allocStatus == OK){
            //read the page in the disk, then move it to bufferpool.
            readPageStatus = file->readPage(PageNo, &bufPool[freeFrameNum]);
            //also update the bufStats
            bufStats.diskreads += 1;

            if(readPageStatus != OK){
                return readPageStatus;
            }
            //insert the page into the hashtable, the freeFrame is a new allocated frame number.
            insertToHash = hashTable->insert(file,PageNo,freeFrameNum);
            // return the status when insertion failed.
            if(insertToHash != OK){
                return insertToHash;
            }
            
            // set the details (pincount, refbit) on the bufferpool. freeFrameNum is from the 
            bufTable[freeFrameNum].Set(file,PageNo);
            //return the pointer of the page
            page = &bufPool[freeFrameNum];
            // increase the access 
            bufStats.accesses += 1;

        }
        // return allocStatus if it failed to allocate the page. (it should return UNIXERR or BUFFEREXCEEDED)
        else{
            return allocStatus;
        }
    }
    // case 2: Page is in the buffer pool
    if(status == OK){
        // set the refbit to true (recently read), frameNum is from the hashtable
        bufTable[frameNum].refbit = true;
        // increase the pin count
        bufTable[frameNum].pinCnt += 1;

        //return the pointer of the page
        page = &bufPool[frameNum];
        // increase the access 
        bufStats.accesses += 1;
        
    }
    
    return OK;

}

/**
 * @brief Decrements the pinCnt of the frame containing (file, PageNo) and, if dirty == true, sets the dirty bit
 * 
 * @return OK if no errors occurred, HASHNOTFOUND if the page is not in the buffer pool hash table, PAGENOTPINNED if the pin count is already 0
 */
const Status BufMgr::unPinPage(File *file, const int PageNo,
                               const bool dirty)
{
    int frameNo = 0;
    Status status = hashTable->lookup(file, PageNo, frameNo);
    
    // check the status
    if (status != OK) { // if errors occur
        return status;
    }

    // check the pinCnt
    BufDesc& testBuf = bufTable[frameNo];
    if (testBuf.pinCnt == 0) { // if the pin count is already 0
        return PAGENOTPINNED;
    }
    testBuf.pinCnt--; // decrement the pin count of the frame containing

    if (dirty == true) {
        testBuf.dirty = true; // if dirty == true, set the dirty bit
    }

    return OK; // if no errors occurred
}

/**
 * @brief Allocate an empty page in the specified file by invoking the file->allocatePage() method.
 *        Then call allocBuf() to obtain a buffer pool frame.
 *        Finally insert an entry into the hash table and Set() is invoked on the frame to set it up properly.
 *        Return both the page number of the newly allocated page to the caller via the pageNo parameter
 *        and a pointer to the buffer frame allocated for the page via the page parameter.
 * 
 * @return OK if no errors occurred, UNIXERR if a Unix error occurred, BUFFEREXCEEDED if all buffer frames are pinned,
 *         and HASHTBLERROR if a hash table error occurred
 */
const Status BufMgr::allocPage(File *file, int &pageNo, Page *&page)
{
    // allocate a new empty page by invoking the file->allocatePage() method
    Status status = file->allocatePage(pageNo);
    if (status != OK) { // if errors occur
        return status;
    }

    // call allocBuf() to obtain a buffer pool frame
    int frameNo = 0;
    status = allocBuf(frameNo);
    if (status != OK) { // if a buffer frame allocation error occurred
        return status;
    }

    // insert a new entry into the hash table
    status = hashTable->insert(file, pageNo, frameNo);
    if (status != OK) { // if a hash table error occurred
        return status;
    }
    bufTable[frameNo].Set(file, pageNo); // set up the buffer frame
    page = &bufPool[frameNo]; // return a pointer to the buffer frame allocated for the page

    return OK; // if no errors occurred
}

const Status BufMgr::disposePage(File *file, const int pageNo)
{
    // see if it is in the buffer pool
    Status status = OK;
    int frameNo = 0;
    status = hashTable->lookup(file, pageNo, frameNo);
    if (status == OK)
    {
        // clear the page
        bufTable[frameNo].Clear();
    }
    status = hashTable->remove(file, pageNo);

    // deallocate it in the file
    return file->disposePage(pageNo);
}

const Status BufMgr::flushFile(const File *file)
{
    Status status;

    for (int i = 0; i < numBufs; i++)
    {
        BufDesc *tmpbuf = &(bufTable[i]);
        if (tmpbuf->valid == true && tmpbuf->file == file)
        {

            if (tmpbuf->pinCnt > 0)
                return PAGEPINNED;

            if (tmpbuf->dirty == true)
            {
#ifdef DEBUGBUF
                cout << "flushing page " << tmpbuf->pageNo
                     << " from frame " << i << endl;
#endif
                if ((status = tmpbuf->file->writePage(tmpbuf->pageNo,
                                                      &(bufPool[i]))) != OK)
                    return status;

                tmpbuf->dirty = false;
            }

            hashTable->remove(file, tmpbuf->pageNo);

            tmpbuf->file = NULL;
            tmpbuf->pageNo = -1;
            tmpbuf->valid = false;
        }

        else if (tmpbuf->valid == false && tmpbuf->file == file)
            return BADBUFFER;
    }

    return OK;
}

void BufMgr::printSelf(void)
{
    BufDesc *tmpbuf;

    cout << endl
         << "Print buffer...\n";
    for (int i = 0; i < numBufs; i++)
    {
        tmpbuf = &(bufTable[i]);
        cout << i << "\t" << (char *)(&bufPool[i])
             << "\tpinCnt: " << tmpbuf->pinCnt;

        if (tmpbuf->valid == true)
            cout << "\tvalid\n";
        cout << endl;
    };
}
