#include "catalog.h"
#include "query.h"

/*
 * Inserts a record into the specified relation.
 *
 * Returns:
 * 	OK on success
 * 	an error code otherwise
 */

const Status QU_Insert(const string &relation,
					   const int attrCnt,
					   const attrInfo attrList[])
{
	// part 6
	Status status;
	Record temp;
	RID rid;
	int relAttrCnt;
	AttrDesc *attrDesc;
	int recLength = 0;

	// firstly try to find the attribute count
	status = attrCat->getRelInfo(relation, relAttrCnt, attrDesc);
	if (status != OK)
	{
		return status;
	}

	// if number not equal
	if (relAttrCnt != attrCnt)
	{
		return OK;
	}
	else
	{
		for (int i = 0; i < attrCnt; i++)
		{
			recLength += attrDesc[i].attrLen;
		}
	}

	// open the relation table base on the parameter
	InsertFileScan resultRel(relation, status);
	if (status != OK)
	{
		return status;
	}

	// update the length and data of that temp record
	temp.length = recLength;
	char* recData = new char[temp.length];
	temp.data = (void *)recData;

	// ensure the orders in attribute list and relations are same
	for (int i = 0; i < relAttrCnt; i++)
	{
		for (int j = 0; j < attrCnt; j++)
		{
			if (strcmp(attrList[j].attrName, attrDesc[i].attrName) == 0)
			{
				switch ((Datatype)attrList[j].attrType)
				{
					// Integer case
					case INTEGER:
					{
						auto value = atoi((char *)attrList[j].attrValue);
						memcpy((char *)temp.data + attrDesc[i].attrOffset, (char *)&value, attrDesc[i].attrLen);
						break;
					}
					// Float case
					case FLOAT:
					{
						auto value = atof((char *)attrList[j].attrValue);
						memcpy((char *)temp.data + attrDesc[i].attrOffset, (char *)&value, attrDesc[i].attrLen);
						break;
					}
					// String case
					case STRING:
					{
						memcpy((char *)temp.data + attrDesc[i].attrOffset, attrList[j].attrValue, attrDesc[i].attrLen);
						break;
					}
				}
				break;
			}
		}
	}

	// use InsertFileScan::insertRecord() to insert
	status = resultRel.insertRecord(temp, rid);
    if (status != OK)
    {
        delete[] recData;
        return status;
    }


	delete[] recData;
	return OK;
}
