import os
from io import StringIO
from datetime import datetime
from graphql import GraphQLError
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

    try:
        root = ET.fromstring(data)
    except:
        raise GraphQLError('XML is not formatted correctly')

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
        '''
            Extract statement info
        '''
        stmtDict = {}
        stmtDict["transaction_reference"] = self.get_text(stmt, namespaces, 'Id')
        stmtDict["account_identification"] = self.get_text(stmt, namespaces, 'Acct/Id/IBAN')
        stmtDict["sequence_number"] = self.get_text(stmt, namespaces, 'ElctrncSeqNb')
        stmtDict["final_opening_balance"] = self.get_final_opening_balance(stmt, namespaces)
        stmtDict["final_closing_balance"] = self.get_balance(stmt, namespaces, "'CLBD'")
        stmtDict["available_balance"] = self.get_balance(stmt, namespaces, "'CLAV'")
        stmtDict["forward_available_balance"] = self.get_forward_balance(stmt, namespaces)

        return stmtDict

    def transactions(self, transactions, namespaces):

        for i in range(len(transactions)):
            transactions[i] = Transaction(transactions[i], namespaces)

        return transactions

    def get_text(self, obj, namespaces, search):
        return obj.findtext(search, namespaces=namespaces)

    def get_forward_balance(self, stmt, namespaces):
        if stmt.find("Bal/Tp/CdOrPrtry/[Cd='FWAV']", namespaces=namespaces):
            balanceString = "'FWAV'"
        else:
            balanceString = "'CLAV'"

        balanceObject = stmt.findall(f"Bal/Tp/CdOrPrtry/[Cd={balanceString}]/../..", namespaces=namespaces)[-1]

        if self.get_text(balanceObject,
                         namespaces,
                         "CdtDbtInd") == 'CRDT':
            statustemp = 'C'
        else:
            statustemp = 'D'
        balance = Balance(float(
            self.get_text(balanceObject, namespaces, 'Amt')),
                          balanceObject.find('Amt', namespaces=namespaces).attrib["Ccy"],
                          statustemp)

        return balance

    def get_balance(self, stmt, namespaces, balanceString):
        balanceObject = stmt.find(f"Bal/Tp/CdOrPrtry/[Cd={balanceString}]/../..", namespaces=namespaces)
        if self.get_text(balanceObject, namespaces, "CdtDbtInd") == 'CRDT':
            statustemp = 'C'
        else:
            statustemp = 'D'
        balance = Balance(float(
            self.get_text(balanceObject, namespaces, 'Amt')),
                          balanceObject.find('Amt', namespaces=namespaces).attrib["Ccy"],
                          statustemp)

        return balance

    def get_final_opening_balance(self, stmt, namespaces):
        prcd = stmt.find("Bal/Tp/CdOrPrtry/[Cd='PRCD']/../..", namespaces=namespaces)
        opbd = stmt.find("Bal/Tp/CdOrPrtry/[Cd='OPBD']/../..", namespaces=namespaces)

        if prcd:
            statustemp = self.get_text(prcd, namespaces, "CdtDbtInd")
            balance = Balance(
                float(self.get_text(prcd, namespaces, 'Amt')),
                prcd.find('Amt', namespaces=namespaces).attrib["Ccy"],
                statustemp)
        elif opbd:
            statustemp = self.get_text(opbd, namespaces, "CdtDbtInd")
            balance = Balance(
                float(self.get_text(opbd, namespaces, 'Amt')),
                opbd.find('Amt', namespaces=namespaces).attrib["Ccy"],
                statustemp)
        else:
            balance = None

        return balance


class Transaction:
    def __init__(self, ntry, namespaces):
        self.data = self.transactionDict(ntry, namespaces)

    def transactionDict(self, ntry, namespaces):
        '''
            extract transaction info
        '''
        transaction = {}
        transaction["tegen_rekening"] = self.get_or_empty(ntry, "./NtryDtls/TxDtls/RltdPties/DbtrAcct/Id/IBAN", namespaces)
        transaction["transaction_details"] = self.get_or_empty(ntry, ".//AddtlNtryInf", namespaces)
        transaction["date"] = datetime.strptime(ntry.findtext("./ValDt/Dt", namespaces=namespaces), '%Y-%m-%d')

        if ntry.findtext("./CdtDbtInd", namespaces=namespaces) == 'CRDT':
            transaction["status"] = 'C'
        else:
            transaction["status"] = 'D'

        transaction["amount"] = Amount(float(ntry.findtext("./Amt", namespaces=namespaces)),
                                       ntry.find("./Amt", namespaces=namespaces).attrib["Ccy"],
                                       transaction["status"])

        transaction["id"] = ntry.findtext("./BkTxCd/Prtry/Cd", namespaces=namespaces)
        transaction["customer_reference"] = self.get_or_empty(ntry, ".//EndToEndId", namespaces)

        extratemp1 = self.get_or_empty(ntry, "./AcctSvcrRef", namespaces)
        extratemp2 = self.get_or_empty(ntry, "./NtryDtls/AddtlTxInf", namespaces)
        transaction["extra_details"] = extratemp1 + extratemp2

        return transaction

    def get_or_empty(self,ntry, search_string, namespaces):
        temp = ntry.findtext(search_string, namespaces=namespaces)
        if temp:
            result = temp
        else:
            result = ""

        return result

class Balance():
    def __init__(self, amnt, crncy, status):
        self.amount = Amount(amnt, crncy, status)
        self.currency = crncy


class Amount():
    def __init__(self, amnt, crncy, status):
        self.amount = amnt

        if status == 'D':
            self.amount = -self.amount
