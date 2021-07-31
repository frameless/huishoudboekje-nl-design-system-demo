import os
from io import StringIO
from datetime import datetime
import xml.etree.ElementTree as ET


def parse(src, encoding=None):
    '''
    Parses CAMT.053 data and returns list of Statement objects

    :param src: file handler to read, filename to read or raw data as string
    :return: list of statement objects
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

    result = parsexml(data)

    return result


def parsexml(data):
    '''
    Parses an XML document in Camt.053 style and returns a list of statement objects ready to be processed by
    the csm mutate function.
    '''
    root = ET.fromstring(data)

    my_namespaces = dict([
        node for _, node in ET.iterparse(
            StringIO(data), events=['start-ns']
        )
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
        stmtDict["sequence_number"] = stmt.findtext('ElctrncSeqNb', namespaces=namespaces)
        stmtDict["final_opening_balance"] = self.get_final_opening_balance(stmt, namespaces)
        stmtDict["final_closing_balance"] = self.get_balance(stmt, namespaces, "'CLBD'")
        stmtDict["available_balance"] = self.get_balance(stmt, namespaces, "'CLAV'")
        stmtDict["forward_available_balance"] = self.get_forward_balance(stmt, namespaces, "'FWAV'")

        return stmtDict

    def transactions(self, transactions, namespaces):

        for i in range(len(transactions)):
            transactions[i] = Transaction(transactions[i], namespaces)

        return transactions

    def get_forward_balance(self, stmt, namespaces, balanceString):
        if stmt.findall(f"Bal/Tp/CdOrPrtry/[Cd={balanceString}]/../..", namespaces=namespaces)[-1].findtext("CdtDbtInd",
                                                                                                     namespaces=namespaces) == 'CRDT':
            statustemp = 'C'
        else:
            statustemp = 'D'
        balance = Balance(float(
            stmt.findall(f"Bal/Tp/CdOrPrtry/[Cd={balanceString}]/../..", namespaces=namespaces)[-1].findtext('Amt',
                                                                                                      namespaces=namespaces)),
                          stmt.findall(f"Bal/Tp/CdOrPrtry/[Cd={balanceString}]/../..", namespaces=namespaces)[-1].find('Amt',
                                                                                                                namespaces=namespaces).attrib["Ccy"],
                          statustemp)

        return balance

    def get_balance(self, stmt, namespaces, balanceString):
        if stmt.find(f"Bal/Tp/CdOrPrtry/[Cd={balanceString}]/../..", namespaces=namespaces).findtext("CdtDbtInd",
                                                                                                     namespaces=namespaces) == 'CRDT':
            statustemp = 'C'
        else:
            statustemp = 'D'
        balance = Balance(float(
            stmt.find(f"Bal/Tp/CdOrPrtry/[Cd={balanceString}]/../..", namespaces=namespaces).findtext('Amt',
                                                                                                      namespaces=namespaces)),
                          stmt.find(f"Bal/Tp/CdOrPrtry/[Cd={balanceString}]/../..", namespaces=namespaces).find('Amt',
                                                                                                                namespaces=namespaces).attrib["Ccy"],
                          statustemp)

        return balance

    def get_final_opening_balance(self, stmt, namespaces):

        if stmt.find("Bal/Tp/CdOrPrtry/[Cd='PRCD']/../..", namespaces=namespaces):
            statustemp = stmt.find("Bal/Tp/CdOrPrtry/[Cd='PRCD']/../..", namespaces=namespaces).findtext("CdtDbtInd",
                                                                                                         namespaces=namespaces)
            balance = Balance(float(
                stmt.find("Bal/Tp/CdOrPrtry/[Cd='PRCD']/../..", namespaces=namespaces).findtext('Amt',
                                                                                                namespaces=namespaces)),
                stmt.find("Bal/Tp/CdOrPrtry/[Cd='PRCD']/../..", namespaces=namespaces).find('Amt',
                                                                                            namespaces=namespaces).attrib[
                    "Ccy"],
                statustemp)
        elif stmt.find("Bal/Tp/CdOrPrtry/[Cd='OPBD']/../..", namespaces=namespaces):
            statustemp = stmt.find("Bal/Tp/CdOrPrtry/[Cd='OPBD']/../..", namespaces=namespaces).findtext("CdtDbtInd",
                                                                                                         namespaces=namespaces)
            balance = Balance(float(
                stmt.find("Bal/Tp/CdOrPrtry/[Cd='OPBD']/../..", namespaces=namespaces).findtext('Amt',
                                                                                                namespaces=namespaces)),
                stmt.find("Bal/Tp/CdOrPrtry/[Cd='OPBD']/../..", namespaces=namespaces).find('Amt',
                                                                                            namespaces=namespaces).attrib[
                    "Ccy"],
                statustemp)

        return balance


class Transaction:
    def __init__(self, ntry, namespaces):
        self.data = self.transactionDict(ntry, namespaces)

    def transactionDict(self, ntry, namespaces):
        transaction = {}
        transaction["transaction_details"] = ntry.findtext(".//AddtlNtryInf", namespaces=namespaces)
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


class Balance():
    def __init__(self, amnt, crncy, status):
        self.amount = Amount(amnt, crncy, status)
        self.currency = crncy


class Amount():
    def __init__(self, amnt, crncy, status):
        self.amount = amnt

        if status == 'D':
            self.amount = -self.amount
