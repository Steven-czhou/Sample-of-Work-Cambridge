#include "catalog.h"
#include "query.h"


/*
 * Deletes records from a specified relation.
 *
 * Returns:
 * 	OK on success
 * 	an error code otherwise
 */

const Status QU_Delete(const string & relation, 
		       const string & attrName, 
		       const Operator op,
		       const Datatype type, 
		       const char *attrValue)
{
	// part 6
	Status status;
	HeapFileScan *hfs = new HeapFileScan(relation, status);
	if (status != OK) { // error in opening the file
		return status;
	}

	// declare variables
	void *valPtr;
	int intVal;
	float floatVal;
	if (!attrName.empty() && attrValue != nullptr) {
    	// check for attribute
    	AttrDesc attrDesc;
    	status = attrCat->getInfo(relation, attrName, attrDesc);
    	if (status != OK) { // error in fetching attribute
    		delete hfs;
    		return status;
    	}

		// deal with datatypes
    	switch (type) {
    	case INTEGER:
      		intVal = atoi(attrValue);
      		valPtr = &intVal;
      		break;
    	case FLOAT:
      		floatVal = atof(attrValue);
      		valPtr = &floatVal;
      		break;
    	case STRING:
      		valPtr = (void *)attrValue;
      		break;
    	}

		// scan with filter
		int offset = attrDesc.attrOffset;
    	int length = attrDesc.attrLen;
    	status = hfs->startScan(offset, length, type,
                            	reinterpret_cast<const char *>(valPtr), op);
    	if (status != OK) { // error in scanning
      		delete hfs;
      		return status;
    	}
  	} else {
    	// do deletion for all records
    	status = hfs->startScan(0, 0, type, nullptr, op);
    	if (status != OK) {
      	delete hfs;
      	return status;
    	}
  	}

	RID output_rid;
  	while ((status = hfs->scanNext(output_rid)) == OK) {
    	hfs->deleteRecord();
  	}

	// end the scan and return status
  	status = hfs->endScan();
  	delete hfs;
  	return status;
}
