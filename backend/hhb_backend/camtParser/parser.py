"""Class to parse camt files."""
### Copyright 2013-2016 Therp BV <https://therp.nl>
### Copyright 2017 Open Net Sàrl
### License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl.html).

### This parser is an altered version of the parser on
### https://github.com/OCA/bank-statement-import/blob/14.0/account_statement_import_camt/models/parser.py


from decimal import Decimal
import re
from lxml import etree
from datetime import datetime


class CamtParser():
    _name = "account.statement.import.camt.parser"
    _description = "Account Bank Statement Import CAMT parser"

    def parse_amount(self, ns, node):
        """Parse element that contains Amount and CreditDebitIndicator."""
        if node is None:
            return 0.0
        sign = 1
        amount = 0.0
        sign_node = node.xpath("ns:CdtDbtInd", namespaces={"ns": ns})
        if not sign_node:
            sign_node = node.xpath("../../ns:CdtDbtInd", namespaces={"ns": ns})
        if sign_node and sign_node[0].text == "DBIT":
            sign = -1
        amount_node = node.xpath("ns:Amt", namespaces={"ns": ns})
        if not amount_node:
            amount_node = node.xpath(
                "./ns:AmtDtls/ns:TxAmt/ns:Amt", namespaces={"ns": ns}
            )
        if amount_node:
            amount = sign * Decimal(amount_node[0].text)
        return amount

    def add_value_from_node(self, ns, node, xpath_str, obj, attr_name, join_str=None):
        """Add value to object from first or all nodes found with xpath.

        If xpath_str is a list (or iterable), it will be seen as a series
        of search path's in order of preference. The first item that results
        in a found node will be used to set a value."""
        if not isinstance(xpath_str, (list, tuple)):
            xpath_str = [xpath_str]
        for search_str in xpath_str:
            found_node = node.xpath(search_str, namespaces={"ns": ns})
            if found_node:
                if isinstance(found_node[0], str):
                    attr_value = found_node[0]
                elif join_str is None:
                    attr_value = found_node[0].text
                else:
                    attr_value = join_str.join([x.text for x in found_node])
                obj[attr_name] = attr_value
                break

    def parse_transaction_details(self, ns, node, transaction):
        """Parse TxDtls node."""
        # message
        self.add_value_from_node(
            ns,
            node,
            [
                "../../ns:AddtlNtryInf",
                "./ns:RmtInf/ns:Ustrd|./ns:RtrInf/ns:AddtlInf",
                "./ns:Refs/ns:InstrId",
            ],
            transaction,
            "payment_ref",
            join_str="\n",
        )

        # name
        self.add_value_from_node(
            ns, node, ["./ns:AddtlTxInf"], transaction, "payment_ref", join_str="\n"
        )
        # eref
        self.add_value_from_node(
            ns,
            node,
            [
                "./ns:RmtInf/ns:Strd/ns:CdtrRefInf/ns:Ref",
                "./ns:Refs/ns:EndToEndId",
                "./ns:Ntry/ns:AcctSvcrRef",
            ],
            transaction,
            "ref",
        )
        amount = self.parse_amount(ns, node)
        if amount != 0.0:
            transaction["amount"] = amount
        # remote party values
        party_type = "Dbtr"
        party_type_node = node.xpath("../../ns:CdtDbtInd", namespaces={"ns": ns})
        if party_type_node and party_type_node[0].text != "CRDT":
            party_type = "Cdtr"
        party_node = node.xpath(
            f"./ns:RltdPties/ns:{party_type}", namespaces={"ns": ns}
        )
        if party_node:
            name_node = node.xpath(
                f"./ns:RltdPties/ns:{party_type}/ns:Nm", namespaces={"ns": ns}
            )
            if name_node:
                self.add_value_from_node(
                    ns, party_node[0], "./ns:Nm", transaction, "partner_name"
                )
            else:
                self.add_value_from_node(
                    ns,
                    party_node[0],
                    "./ns:PstlAdr/ns:AdrLine",
                    transaction,
                    "partner_name",
                )
        # Get remote_account from iban or from domestic account:
        account_node = node.xpath(
            f"./ns:RltdPties/ns:{party_type}Acct/ns:Id", namespaces={"ns": ns}
        )
        if account_node:
            iban_node = account_node[0].xpath("./ns:IBAN", namespaces={"ns": ns})
            if iban_node:
                transaction["account_number"] = iban_node[0].text
            else:
                self.add_value_from_node(
                    ns,
                    account_node[0],
                    "./ns:Othr/ns:Id",
                    transaction,
                    "account_number",
                )

    def parse_entry(self, ns, node):
        """Parse an Ntry node and yield transactions"""
        transaction = {"payment_ref": "/", "amount": 0}  # fallback defaults

        self.add_value_from_node(ns, node, "./ns:ValDt/ns:Dt", transaction, "date")

        amount = self.parse_amount(ns, node)
        if amount != 0.0:
            transaction["amount"] = amount
        self.add_value_from_node(
            ns, node, "./ns:AddtlNtryInf", transaction, "narration"
        )

        self.add_value_from_node(
            ns, node, "./BkTxCd/Prtry/Cd", transaction, "id"
        )

        self.add_value_from_node(
            ns,
            node,
            [
                "./ns:NtryDtls/ns:RmtInf/ns:Strd/ns:CdtrRefInf/ns:Ref",
                "./ns:NtryDtls/ns:Btch/ns:PmtInfId",
                "./ns:NtryDtls/ns:TxDtls/ns:Refs/ns:AcctSvcrRef",
            ],
            transaction,
            "ref",
        )

        details_nodes = node.xpath("./ns:NtryDtls/ns:TxDtls", namespaces={"ns": ns})
        if len(details_nodes) == 0:
            yield transaction
            return
        transaction_base = transaction
        for node in details_nodes:
            transaction = transaction_base.copy()
            self.parse_transaction_details(ns, node, transaction)
            yield transaction

    def get_balance_amounts(self, ns, node):
        """Return opening and closing balance.

        Depending on kind of balance and statement, the balance might be in a
        different kind of node:
        OPBD = OpeningBalance
        PRCD = PreviousClosingBalance
        ITBD = InterimBalance (first ITBD is start-, second is end-balance)
        CLBD = ClosingBalance

        Added -
        CLAV = Closing Available Balance
        FWAV = Forward Available Balance
        -
        """
        start_balance_node = None
        end_balance_node = None

        avail_balance_node = None
        forward_balance_node = None

        for node_name in ["OPBD", "PRCD", "CLBD", "ITBD", "CLAV", "FWAV"]:
            code_expr = (
                f'./ns:Bal/ns:Tp/ns:CdOrPrtry/ns:Cd[text()="{node_name}"]/../../..'
            )
            balance_node = node.xpath(code_expr, namespaces={"ns": ns})
            if balance_node:
                if node_name in ["OPBD", "PRCD"]:
                    start_balance_node = balance_node[0]
                elif node_name == "CLBD":
                    end_balance_node = balance_node[0]

                elif node_name == "CLAV":
                    avail_balance_node = balance_node[0]
                elif node_name == "FWAV":
                    forward_balance_node = balance_node[0]

                else:
                    if not start_balance_node:
                        start_balance_node = balance_node[0]
                    if not end_balance_node:
                        end_balance_node = balance_node[-1]

            if forward_balance_node is None:
                forward_balance_node = end_balance_node
            if avail_balance_node is None:
                avail_balance_node = end_balance_node

        return (
            Balance(self.parse_amount(ns, start_balance_node)),
            Balance(self.parse_amount(ns, avail_balance_node)),
            Balance(self.parse_amount(ns, end_balance_node)),
            Balance(self.parse_amount(ns, forward_balance_node))
        )

    def parse_statement(self, ns, node):
        """Parse a single Stmt node."""
        result = {}

        self.add_value_from_node(
            ns,
            node,
            ["./ns:Acct/ns:Id/ns:IBAN", "./ns:Acct/ns:Id/ns:Othr/ns:Id"],
            result,
            "account_identification",
        )

        self.add_value_from_node(ns, node, "./ns:Id", result, "transaction_reference")
        self.add_value_from_node(ns, node, './ElctrncSeqNb', result, "sequence_number")

        self.add_value_from_node(
            ns, node, ["./ns:Acct/ns:Ccy", "./ns:Bal/ns:Amt/@Ccy"], result, "currency"
        )

        result["final_opening_balance"], result["available_balance"], result["final_closing_balance"], result["forward_available_balance"] = \
            self.get_balance_amounts(ns, node)

        entry_nodes = node.xpath("./ns:Ntry", namespaces={"ns": ns})
        transactions = []
        for entry_node in entry_nodes:
            transactions.extend(self.parse_entry(ns, entry_node))

        transObject = []
        for trans in transactions:
            transObject.append(Transaction(trans))

        result["date"] = None
        if transactions:
            result["date"] = sorted(
                transactions, key=lambda x: x["date"], reverse=True
            )[0]["date"]

        return Statement(result, transObject)

    def check_version(self, ns, root):
        """Validate validity of camt file."""
        # Check whether it is camt at all:
        re_camt = re.compile(r"(^urn:iso:std:iso:20022:tech:xsd:camt." r"|^ISO:camt.)")
        if not re_camt.search(ns):
            raise ValueError("no camt: " + ns)
        # Check whether version 052 ,053 or 054:
        re_camt_version = re.compile(
            r"(^urn:iso:std:iso:20022:tech:xsd:camt.054."
            r"|^urn:iso:std:iso:20022:tech:xsd:camt.053."
            r"|^urn:iso:std:iso:20022:tech:xsd:camt.052."
            r"|^ISO:camt.054."
            r"|^ISO:camt.053."
            r"|^ISO:camt.052.)"
        )
        if not re_camt_version.search(ns):
            raise ValueError("no camt 052 or 053 or 054: " + ns)
        # Check GrpHdr element:
        root_0_0 = root[0][0].tag[len(ns) + 2 :]  # strip namespace
        if root_0_0 != "GrpHdr":
            raise ValueError("expected GrpHdr, got: " + root_0_0)

    def parse(self, data):
        """Parse a camt.052 or camt.053 or camt.054 file."""
        try:
            root = etree.fromstring(data, parser=etree.XMLParser(recover=True, resolve_entities=False)) # resolve_entities=False is to prevent XXE attacks (see https://gitlab.com/commonground/huishoudboekje/app-new/-/issues/915#note_1066352345)
        except etree.XMLSyntaxError:
            try:
                # ABNAmro is known to mix up encodings
                root = etree.fromstring(data.decode("iso-8859-15").encode("utf-8"), parser=etree.XMLParser(recover=True, resolve_entities=False)) # resolve_entities=False is to prevent XXE attacks (see https://gitlab.com/commonground/huishoudboekje/app-new/-/issues/915#note_1066352345)
            except etree.XMLSyntaxError:
                root = None
        if root is None:
            raise ValueError("Not a valid xml file, or not an xml file at all.")
        ns = root.tag[1 : root.tag.index("}")]
        self.check_version(ns, root)
        statements = []
        for node in root[0][1:]:
            statement = self.parse_statement(ns, node)

            statements.append(statement)

        return statements


class Statement():
    def __init__(self, result, trans):
        self.data = result
        self.transactions = trans

class Amount():
    def __init__(self, amnt):
        self.amount = amnt

class Balance():
    def __init__(self, amnt):
        self.amount = Amount(amnt)

class Transaction:
    def __init__(self, transaction):
        self.data = self.transactionAdapt(transaction)

    def transactionAdapt(self, transaction):
        ### Edit and add keys for certain values for a better fit in our application
        self.searchAndReplace(transaction, "account_number", "tegen_rekening")
        self.searchAndReplace(transaction, "payment_ref", "transaction_details")
        self.searchAndReplace(transaction, "ref", "customer_reference")
        self.searchAndReplace(transaction, "narration", "extra_details")

        if transaction["transaction_details"] == "/":
            transaction["transaction_details"] = transaction["customer_reference"]

        if transaction["transaction_details"] == "":
            transaction["transaction_details"] = transaction["extra_details"]

        if transaction["amount"] < 0:
            transaction["status"] = 'D'
        else:
            transaction["status"] = 'C'
        transaction["amount"] = Amount(transaction.pop("amount"))
        transaction["date"] = datetime.strptime(transaction["date"], "%Y-%m-%d")

        if not transaction.get("id", False):
            transaction["id"] = ""

        return transaction

    def searchAndReplace(self, object, search_string, replace_string):
        if object.get(search_string, False):
            object[replace_string] = object.pop(search_string)
        else:
            object[replace_string] = ""

        return
