#include "heapfile.h"
#include "error.h"

// routine to create a heapfile
const Status createHeapFile(const string fileName)
{
    File *file;
    Status status;
    FileHdrPage *hdrPage;
    int hdrPageNo;
    int newPageNo;
    Page *newPage;

    // try to open the file. This should return an error
    status = db.openFile(fileName, file);
    if (status != OK)
    {
        // file doesn't exist. First create it and allocate
        // an empty header page and data page.
        status = db.createFile(fileName); // create the file
        if (status != OK)
            return (status);

        status = db.openFile(fileName, file); // open the file
        if (status != OK)
            return (status);

        // allocate a header page and copy the file name
        status = bufMgr->allocPage(file, hdrPageNo, newPage);
        if (status != OK)
            return (status);
        hdrPage = (FileHdrPage *)newPage;
        strncpy(hdrPage->fileName, fileName.c_str(), MAXNAMESIZE); // copy file name

        // allocate and initialize an empty data page
        status = bufMgr->allocPage(file, newPageNo, newPage);
        if (status != OK)
            return (status);
        newPage->init(newPageNo);

        // set pointers for header page and data page
        status = newPage->setNextPage(-1);
        hdrPage->recCnt = 0;
        hdrPage->pageCnt = 1;
        hdrPage->firstPage = hdrPage->lastPage = newPageNo;

        // unpin pages (header page and data page)
        status = bufMgr->unPinPage(file, newPageNo, true); // the data page
        if (status != OK)
            return (status);

        status = bufMgr->unPinPage(file, hdrPageNo, true); // the header page
        if (status != OK)
            return (status);

        // flush and close file
        status = bufMgr->flushFile(file); // flush
        if (status != OK)
            return (status);

        status = db.closeFile(file); // close
        if (status != OK)
            return (status);
        else
            return (OK);
    }
    return (FILEEXISTS);
}

// routine to destroy a heapfile
const Status destroyHeapFile(const string fileName)
{
    return (db.destroyFile(fileName));
}

// constructor opens the underlying file
HeapFile::HeapFile(const string &fileName, Status &returnStatus)
{
    Status status;
    Page *pagePtr;

    // cout << "opening file " << fileName << endl;

    // open the file and read in the header page and the first data page
    if ((status = db.openFile(fileName, filePtr)) == OK)
    {
        // assign the header page
        status = filePtr->getFirstPage(headerPageNo);
        if (status != OK)
        {
            cerr << "get of first header page failed\n";
            returnStatus = status;
        }

        status = bufMgr->readPage(filePtr, headerPageNo, pagePtr);
        if (status != OK)
        {
            cerr << "read of header page failed\n";
            returnStatus = status;
        }

        headerPage = (FileHdrPage *)pagePtr; // assign pointer
        hdrDirtyFlag = false;                // set dirty flag

        // read the first data page into curPage and curPageNo
        curPageNo = headerPage->firstPage;
        status = bufMgr->readPage(filePtr, curPageNo, curPage);
        if (status != OK)
        {
            cerr << "read of data page failed\n";
            returnStatus = status;
        }

        curDirtyFlag = false; // set dirty flag
        curRec = NULLRID;     // initialize curRec
        returnStatus = OK;
        return;
    }
    else
    {
        cerr << "open of heap file failed\n";
        returnStatus = status;
        return;
    }
}

// the destructor closes the file
HeapFile::~HeapFile()
{
    Status status;
    // cout << "invoking heapfile destructor on file " << headerPage->fileName << endl;

    // see if there is a pinned data page. If so, unpin it
    if (curPage != NULL)
    {
        status = bufMgr->unPinPage(filePtr, curPageNo, curDirtyFlag);
        curPage = NULL;
        curPageNo = 0;
        curDirtyFlag = false;
        if (status != OK)
            cerr << "error in unpin of date page\n";
    }

    // unpin the header page
    status = bufMgr->unPinPage(filePtr, headerPageNo, hdrDirtyFlag);
    if (status != OK)
        cerr << "error in unpin of header page\n";

    // status = bufMgr->flushFile(filePtr);  // make sure all pages of the file are flushed to disk
    // if (status != OK) cerr << "error in flushFile call\n";
    // before close the file
    status = db.closeFile(filePtr);
    if (status != OK)
    {
        cerr << "error in closefile call\n";
        Error e;
        e.print(status);
    }
}

// Return number of records in heap file

const int HeapFile::getRecCnt() const
{
    return headerPage->recCnt;
}

// retrieve an arbitrary record from a file.
// if record is not on the currently pinned page, the current page
// is unpinned and the required page is read into the buffer pool
// and pinned.  returns a pointer to the record via the rec parameter

const Status HeapFile::getRecord(const RID &rid, Record &rec)
{
    Status status;

    // cout<< "getRecord. record (" << rid.pageNo << "." << rid.slotNo << ")" << endl;

    if (curPage != NULL)
    {
        // if we fortunately find the current page is the page we are looking for
        if (rid.pageNo == curPageNo)
        {
            status = curPage->getRecord(rid, rec);
            curRec = rid;
            return OK;
        }
        else
        { // if not, change the current page and other info
            status = bufMgr->unPinPage(filePtr, curPageNo, curDirtyFlag);
            if (status != OK)
            {
                curPage = NULL;
                curPageNo = 0;
                curDirtyFlag = false;
                curRec = NULLRID;
                return status;
            }
            // if we successfully unpin the previous current page, we read a new page and update info
            status = bufMgr->readPage(filePtr, rid.pageNo, curPage);
            if (status != OK)
            {
                return status;
            }
            curPageNo = rid.pageNo;
            curDirtyFlag = false;
            curRec = rid;
            status = curPage->getRecord(rid, rec);

            return status;
        }
    }
    else
    { // if curPage is NULL
        status = bufMgr->readPage(filePtr, rid.pageNo, curPage);
        if (status != OK)
        {
            return status;
        }

        // update HeapFile info
        curPageNo = rid.pageNo;
        curDirtyFlag = false;
        curRec = rid;
        status = curPage->getRecord(rid, rec);
        return status;
    }
}

HeapFileScan::HeapFileScan(const string &name,
                           Status &status) : HeapFile(name, status)
{
    filter = NULL;
}

const Status HeapFileScan::startScan(const int offset_,
                                     const int length_,
                                     const Datatype type_,
                                     const char *filter_,
                                     const Operator op_)
{
    if (!filter_)
    { // no filtering requested
        filter = NULL;
        return OK;
    }

    if ((offset_ < 0 || length_ < 1) ||
        (type_ != STRING && type_ != INTEGER && type_ != FLOAT) ||
        (type_ == INTEGER && length_ != sizeof(int) || type_ == FLOAT && length_ != sizeof(float)) ||
        (op_ != LT && op_ != LTE && op_ != EQ && op_ != GTE && op_ != GT && op_ != NE))
    {
        return BADSCANPARM;
    }

    offset = offset_;
    length = length_;
    type = type_;
    filter = filter_;
    op = op_;

    return OK;
}

const Status HeapFileScan::endScan()
{
    Status status;
    // generally must unpin last page of the scan
    if (curPage != NULL)
    {
        status = bufMgr->unPinPage(filePtr, curPageNo, curDirtyFlag);
        curPage = NULL;
        curPageNo = 0;
        curDirtyFlag = false;
        return status;
    }
    return OK;
}

HeapFileScan::~HeapFileScan()
{
    endScan();
}

const Status HeapFileScan::markScan()
{
    // make a snapshot of the state of the scan
    markedPageNo = curPageNo;
    markedRec = curRec;
    return OK;
}

const Status HeapFileScan::resetScan()
{
    Status status;
    if (markedPageNo != curPageNo)
    {
        if (curPage != NULL)
        {
            status = bufMgr->unPinPage(filePtr, curPageNo, curDirtyFlag);
            if (status != OK)
                return status;
        }
        // restore curPageNo and curRec values
        curPageNo = markedPageNo;
        curRec = markedRec;
        // then read the page
        status = bufMgr->readPage(filePtr, curPageNo, curPage);
        if (status != OK)
            return status;
        curDirtyFlag = false; // it will be clean
    }
    else
        curRec = markedRec;
    return OK;
}

const Status HeapFileScan::scanNext(RID &outRid)
{
    Status status = OK;
    RID nextRid;
    RID tmpRid;
    int nextPageNo;
    Record rec;

    bool match = false;

    // encounter the end of the file
    if (curPageNo == -1)
    {
        return FILEEOF;
    }

    // maybe it's the first record of the first page
    if (curPage == NULL)
    {
        // try to read the first page
        curPageNo = headerPage->firstPage;
        if (curPageNo == -1) // if no page in this file
        {
            return FILEEOF;
        }

        status = bufMgr->readPage(filePtr, curPageNo, curPage);
        if (status != OK)
        {
            return status;
        }
        else
        {
            // if successfully read the page, init the page
            curDirtyFlag = false;
            curRec = NULLRID;

            // then get the first record
            status = curPage->firstRecord(tmpRid);

            // if there are a page but no more records
            if (status == NOMORERECS)
            {
                // unpin the page and update the info
                status = bufMgr->unPinPage(filePtr, curPageNo, curDirtyFlag);
                if (status != OK)
                {
                    return status;
                }
                curPageNo = -1;
                curPage = NULL;
                curDirtyFlag = false;
                curRec = NULLRID;
                return FILEEOF;
            }
            else
            {
                curRec = tmpRid;
                status = curPage->getRecord(tmpRid, rec);
                if (status != OK)
                {
                    return status;
                }

                // check the predicate condition
                if (matchRec(rec))
                {
                    outRid = tmpRid;
                    match = true;
                    return OK;
                }
            }
        }
    }

    // if still the first record does not satisfy, then do the infinite loop
    while (!match)
    {
        // gets next record through current record
        status = curPage->nextRecord(curRec, nextRid);

        if (status == OK)
        {
            curRec = nextRid;
        }
        else
        {
            // if there is no record here
            while (status != OK)
            {
                curPage->getNextPage(nextPageNo);
                // if end of the file
                if (nextPageNo == -1)
                {
                    return FILEEOF;
                }
                else
                {
                    // unpin the page since moving to next page
                    status = bufMgr->unPinPage(filePtr, curPageNo, curDirtyFlag);
                    curPage = NULL;
                    curPageNo = -1;
                    curDirtyFlag = false;
                    curRec = NULLRID;
                    if (status != OK)
                    {
                        return status;
                    }

                    curPageNo = nextPageNo;
                    status = bufMgr->readPage(filePtr, curPageNo, curPage);
                    if (status != OK)
                    {
                        return status;
                    }
                    status = curPage->firstRecord(curRec); // get the first record of that page (don't need to check status here since it will be checked at the beginning of the next loop)
                }
            }
        }

        status = curPage->getRecord(curRec, rec);
        if (status != OK)
        {
            return status;
        }

        // check the predicate condition
        if (matchRec(rec) == true)
        {
            outRid = curRec;
            match = true;
            return OK;
        }
    }
    return status;
}

// returns pointer to the current record.  page is left pinned
// and the scan logic is required to unpin the page

const Status HeapFileScan::getRecord(Record &rec)
{
    return curPage->getRecord(curRec, rec);
}

// delete record from file.
const Status HeapFileScan::deleteRecord()
{
    Status status;

    // delete the "current" record from the page
    status = curPage->deleteRecord(curRec);
    curDirtyFlag = true;

    // reduce count of number of records in the file
    headerPage->recCnt--;
    hdrDirtyFlag = true;
    return status;
}

// mark current page of scan dirty
const Status HeapFileScan::markDirty()
{
    curDirtyFlag = true;
    return OK;
}

const bool HeapFileScan::matchRec(const Record &rec) const
{
    // no filtering requested
    if (!filter)
        return true;

    // see if offset + length is beyond end of record
    // maybe this should be an error???
    if ((offset + length - 1) >= rec.length)
        return false;

    float diff = 0; // < 0 if attr < fltr
    switch (type)
    {

    case INTEGER:
        int iattr, ifltr; // word-alignment problem possible
        memcpy(&iattr,
               (char *)rec.data + offset,
               length);
        memcpy(&ifltr,
               filter,
               length);
        diff = iattr - ifltr;
        break;

    case FLOAT:
        float fattr, ffltr; // word-alignment problem possible
        memcpy(&fattr,
               (char *)rec.data + offset,
               length);
        memcpy(&ffltr,
               filter,
               length);
        diff = fattr - ffltr;
        break;

    case STRING:
        diff = strncmp((char *)rec.data + offset,
                       filter,
                       length);
        break;
    }

    switch (op)
    {
    case LT:
        if (diff < 0.0)
            return true;
        break;
    case LTE:
        if (diff <= 0.0)
            return true;
        break;
    case EQ:
        if (diff == 0.0)
            return true;
        break;
    case GTE:
        if (diff >= 0.0)
            return true;
        break;
    case GT:
        if (diff > 0.0)
            return true;
        break;
    case NE:
        if (diff != 0.0)
            return true;
        break;
    }

    return false;
}

InsertFileScan::InsertFileScan(const string &name,
                               Status &status) : HeapFile(name, status)
{
    // Do nothing. Heapfile constructor will bread the header page and the first
    //  data page of the file into the buffer pool
}

InsertFileScan::~InsertFileScan()
{
    Status status;
    // unpin last page of the scan
    if (curPage != NULL)
    {
        status = bufMgr->unPinPage(filePtr, curPageNo, true);
        curPage = NULL;
        curPageNo = 0;
        if (status != OK)
            cerr << "error in unpin of data page\n";
    }
}

// Insert a record into the file
const Status InsertFileScan::insertRecord(const Record &rec, RID &outRid)
{
    Page *newPage;
    int newPageNo;
    Status status, unpinstatus;
    RID rid;

    // check for very large records
    if ((unsigned int)rec.length > PAGESIZE - DPFIXED)
    {
        // will never fit on a page, so don't even bother looking
        return INVALIDRECLEN;
    }

    // check if the current page is null
    if (curPage == NULL)
    {
        status = bufMgr->readPage(filePtr, headerPage->lastPage, curPage);
        if (status == OK)
        {
            curPageNo = headerPage->lastPage;
        }
        else
        {
            cerr << "error: status " << status;
        }
    }
    // insert the currPage's record
    status = curPage->insertRecord(rec, rid);
    // if successful, update data fields
    if (status == OK)
    {
        headerPage->recCnt += 1;
        hdrDirtyFlag = true;
        curDirtyFlag = true;
        outRid = rid;
        return OK;
    }
    // current page is full
    else if (status == NOSPACE)
    {
        // allocate new space
        status = bufMgr->allocPage(filePtr, newPageNo, newPage);
        if (status == OK)
        {
            // create new page
            newPage->init(newPageNo);
            status = newPage->setNextPage(-1);
            if (status != OK)
            {
                return status;
            }
            // link the newpage into curPage.
            int nextPageID;
            status = curPage->getNextPage(nextPageID);
            if (status != OK)
            {
                return status;
            }
            // if the currPage is the last page, change the last page No. to the new page No.
            if (nextPageID == -1)
            {
                headerPage->lastPage = newPageNo;
            }
            status = curPage->setNextPage(newPageNo);
            if (status != OK)
            {
                return status;
            }
            // if nextPageId is -1, new page is the last page.
            status = newPage->setNextPage(nextPageID);
            if (status != OK)
            {
                return status;
            }
            // increment page count
            headerPage->pageCnt++;
            // update unpinstatus
            unpinstatus = bufMgr->unPinPage(filePtr, curPageNo, curDirtyFlag);
            if (unpinstatus != OK)
            {
                return status;
            }
            curPage = newPage;
            curPageNo = newPageNo;
            // do the insertion again. It should works now.
            status = curPage->insertRecord(rec, rid);
            if (status == OK)
            {
                headerPage->recCnt += 1;
                hdrDirtyFlag = true;
                curDirtyFlag = true;
                outRid = rid;
                return OK;
            }
            else
            {
                return status;
            }
        }
        // error when allocating new page.
        return status;
    }
    // other errors
    else
    {
        return status;
    }
}
