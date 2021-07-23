import os

import xml.etree.ElementTree as ET

def parse(src, encoding=None):
    '''
    Parses CAMT.053 data and returns Camt object

    :param src: file handler to read, filename to read or raw data as string
    :return: Camt object
    :rtype: Camt
    '''

    def safe_is_file(filename):
        try:
            return os.path.isfile(src)
        except ValueError:  # pragma: no cover
            return False

    if hasattr(src, 'read'):  # pragma: no branch
        data = src.read()
    elif safe_is_file(src):
        with open(src, 'rb') as fh:
            data = fh.read()
    else:  # pragma: no cover
        data = src

    if hasattr(data, 'decode'):  # pragma: no branch
        exception = None
        encodings = [encoding, 'utf-8', 'cp852', 'iso8859-15', 'latin1']

        for encoding in encodings:  # pragma: no cover
            if not encoding:
                continue

            try:
                data = data.decode(encoding)
                break
            except UnicodeDecodeError as e:
                exception = e
            except UnicodeEncodeError:
                break
        else:
            raise exception  # pragma: no cover

    result = getStatements(data)

    return result


def getStatements(data):
    tree = ET.parse(data)
    root = tree.getroot()
    my_namespaces = dict([
        node for _, node in ET.iterparse(data, events=['start-ns'])
    ])
    statements = root.findall('.//Stmt', my_namespaces)

    for stmt in statements:
        stmt = Statement(stmt, my_namespaces)

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
    def __init__(self, ntryData, namespaces):
        self.data = self.transactionDict(ntryData, namespaces)

    def transactionDict(self, ntryData, namespaces):
        transaction = {}


        return transaction
