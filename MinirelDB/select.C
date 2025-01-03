#include "catalog.h"
#include "query.h"
#include "stdio.h"
// forward declaration
const Status ScanSelect(const string &result,
						const int projCnt,
						const AttrDesc projNames[],
						const AttrDesc *attrDesc,
						const Operator op,
						const char *filter,
						const int reclen);

/*
 * Selects records from the specified relation.
 *
 * Returns:
 * 	OK on success
 * 	an error code otherwise
 */

const Status QU_Select(const string &result,
					   const int projCnt,
					   const attrInfo projNames[],
					   const attrInfo *attr,
					   const Operator op,
					   const char *attrValue)
{
	// Qu_Select sets up things and then calls ScanSelect to do the actual work
	cout << "Doing QU_Select " << endl;

	// create a static array, length is projCnt, to store obtained attribute description information
	AttrDesc projectionDesc[projCnt];

	int i = 0;
	Status status;
	int reclen = 0;
	while (i < projCnt)
	{
		status = attrCat->getInfo(projNames[i].relName, projNames[i].attrName, projectionDesc[i]);

		if (status != OK)
		{
			return status;
		}
		// also update total length
		reclen += projectionDesc[i].attrLen;

		i++;
	}
	// Stores descriptive information about the search criteria for a single attribute
	AttrDesc *attrDesc = nullptr;

	if (attr != nullptr)
	{
		attrDesc = new AttrDesc;
		status = attrCat->getInfo(attr->relName, attr->attrName, *attrDesc);
		if (status != OK)
		{
			delete attrDesc;
			return status;
		}
	}
	// note that we will convert attrValue (filter) to desired type in ScanSelect.
	return ScanSelect(result, projCnt, projectionDesc, attrDesc, op, attrValue, reclen);
}

const Status ScanSelect(const string &result,
						const int projCnt,
						const AttrDesc projNames[],
						const AttrDesc *attrDesc,
						const Operator op,
						const char *filter,
						const int reclen)
{
	cout << "Doing HeapFileScan Selection using ScanSelect()" << endl;

	// create a temporary record for output table.
	Record outputTmpRecord;
	outputTmpRecord.length = reclen;
	outputTmpRecord.data = new char[reclen];

	// open "result"
	Status status;
	InsertFileScan resultRel(result, status);
	if (status != OK)
	{
		return status;
	}

	// open current table (to be scanned) as a HeapFileScan object
	HeapFileScan scanTable(projNames[0].relName, status);
	if (status != OK)
	{
		return status;
	}
	// if attrDesc is NULL, start scanning.
	if (attrDesc == NULL)
	{
		scanTable.startScan(0, 0, STRING, NULL, EQ);
	}
	// before scanning, convert filter(attrValue) to desired type (String, float, or integer).
	int intFilter;
	float flFilter;
	if (attrDesc != NULL)
	{
		switch (attrDesc->attrType)
		{
		case INTEGER:
			intFilter = atoi(filter);
			break;
		case FLOAT:
			flFilter = atof(filter);
			break;
		}
	}

	// start scanning.
	if (attrDesc != NULL)
	{

		switch (attrDesc->attrType)
		{
		case INTEGER:
			status = scanTable.startScan(attrDesc->attrOffset, attrDesc->attrLen, INTEGER, (char *)&intFilter, op);
			break;
		case FLOAT:
			status = scanTable.startScan(attrDesc->attrOffset, attrDesc->attrLen, FLOAT, (char *)&flFilter, op);
			break;
		case STRING:
			status = scanTable.startScan(attrDesc->attrOffset, attrDesc->attrLen, STRING, filter, op);
			break;
		}
	}
	if (status != OK)
	{
		return status;
	}
	RID rid;
	Record record;
	// scan the current table. If find a record, then identify its type, and copy data over the outputtemp record.
	while (scanTable.scanNext(rid) == OK)
	{
		// get current record
		status = scanTable.getRecord(record);
		if (status != OK)
		{
			return status;
		}

		// match and copy data over the outputtemp record.
		int outputOffset = 0;
		for (int i = 0; i < projCnt; i++)
		{

			memcpy(outputTmpRecord.data + outputOffset, (void *)((long)record.data + projNames[i].attrOffset), projNames[i].attrLen);

			outputOffset += projNames[i].attrLen;
		}
		// get output RID
		RID outputRID;
		status = resultRel.insertRecord(outputTmpRecord, outputRID);
		if (status != OK)
		{
			return status;
		}
	}

	status = scanTable.endScan();
	if (status != OK)
	{
		return status;
	}

	return OK;
}
