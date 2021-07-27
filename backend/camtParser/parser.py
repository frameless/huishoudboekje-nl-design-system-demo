import os
from datetime import datetime
import xml.etree.ElementTree as ET


def parse(src, encoding=None):
    '''
    Parses CAMT.053 data and returns Camt object

    :param src: file handler to read, filename to read or raw data as string
    :return: list of statement objects
    '''

    result = parsexml(src)

    return result


def parsexml(src):
    '''
    Parses an XML document in Camt.053 style and returns a list of statement objects ready to be processed by
    the csm mutate function.
    '''

    tree = ET.parse(src)
    root = tree.getroot()

    # namespaces are needed to search the XML tree
    my_namespaces = dict([
        node for _, node in ET.iterparse(src, events=['start-ns'])
    ])

    statements = root.findall('.//Stmt', my_namespaces)

    for i in range(len(statements)):
        statements[i] = Statement(statements[i], my_namespaces)

    return statements


class Statement:
    def __init__(self, stmt, namespaces):
        self.data = self.statementDict(stmt, namespaces)
        self.transactions = self.transactions(stmt.findall('.//Ntry', namespaces), namespaces)

    def statementDict(self, stmt, namespaces):
        stmtDict = {}
        stmtDict["transaction_reference"] = stmt.findtext('Id', namespaces=namespaces)
        stmtDict["account_identification"] = stmt.findtext('Acct/Id/IBAN', namespaces=namespaces)
        stmtDict["sequence_number"] = stmt.findtext('EltrncSeqNb', namespaces=namespaces)
        stmtDict["final_opening_balance"] = float(stmt.find("Bal/Tp/CdOrPrtry/[Cd='PRCD']/../..", namespaces=namespaces).findtext('Amt', namespaces=namespaces))
        stmtDict["final_closing_balance"] = float(stmt.find("Bal/Tp/CdOrPrtry/[Cd='CLBD']/../..", namespaces=namespaces).findtext('Amt', namespaces=namespaces))
        stmtDict["available_balance"] = float(stmt.find("Bal/Tp/CdOrPrtry/[Cd='CLAV']/../..", namespaces=namespaces).findtext('Amt', namespaces=namespaces))
        stmtDict["forward_available_balance"] = float(stmt.findall("Bal/Tp/CdOrPrtry/[Cd='FWAV']/../..", namespaces=namespaces)[-1].findtext('Amt', namespaces=namespaces))

        return stmtDict

    def transactions(self, transactions, namespaces):
        for t in transactions:
            Transaction(t, namespaces)

        return transactions


class Transaction:
    def __init__(self, ntry, namespaces):
        self.data = self.transactionDict(ntry, namespaces)

    def transactionDict(self, ntry, namespaces):
        transaction = {}
        transaction["transaction_details"] = ntry.find(".//AddtlNtryInf", namespaces=namespaces)
        transaction["date"] = datetime.strptime(ntry.findtext("./ValDt/Dt", namespaces=namespaces), '%Y-%m-%d')
        if ntry.findtext("./CdtDbtInd", namespaces=namespaces) == 'CRDT':
            transaction["status"] = 'C'
        else:
            transaction["status"] = 'D'
        transaction["amount"] = Amount(float(ntry.findtext("./Amt", namespaces=namespaces)),
                                       ntry.find("./Amt", namespaces=namespaces).attrib["Ccy"],
                                       transaction["status"])
        transaction["id"] = ntry.findtext("./BkTxCd/Prtry/Cd", namespaces=namespaces)
        if ntry.findtext(".//EndToEndId", namespaces=namespaces):
            transaction["customer_reference"] = ntry.findtext(".//EndToEndId", namespaces=namespaces)
        else:
            transaction["customer_reference"] = ""
        if ntry.findtext("./AcctSvcrRef", namespaces=namespaces):
            extratemp1 = ntry.findtext("./AcctSvcrRef", namespaces=namespaces)
        else:
            extratemp1 = ""
        if ntry.findtext("./NtryDtls/AddtlTxInf", namespaces=namespaces):
            extratemp2 = ntry.findtext("./NtryDtls/AddtlTxInf", namespaces=namespaces)
        else:
            extratemp2 = ""
        transaction["extra_details"] = extratemp1 + extratemp2

        return transaction


class Amount():
    def __init__(self, amnt, crncy, status):
        self.amount = amnt
        self.currency = crncy

        if status == 'D':
            self.amount = -self.amount
