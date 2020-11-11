""" Factories to generate objects within a test scope """
from datetime import datetime

from models.customer_statement_message import CustomerStatementMessage


class CustomerStatementMessageFactory():
    """ Factory for CSM objects """

    raw_data: str = """"{1:F01INGBNL2ABXXX0000000000}{2:I940INGBNL2AXXXN}{
        4::20:P140220000000001:25:NL69INGB0123456789EUR:28C:00000:60F:C140219EUR662,23:61:1402200220C1,
        56NTRFEREF//00000000001005/TRCD/00100/:86:/EREF/EV12341REP1231456T1234//CNTP/NL32INGB0000012345/INGBNL2A/ING 
        BANK NV INZAKE WEB///REMI/USTD//EV10001REP1000000T1000/:61:1402200220D1,
        57NTRFPREF//00000000001006/TRCD/00200/:86:/PREF/M000000003333333//REMI/USTD//TOTAAL 1 VZ/:61:1402200220C1,
        57NRTIEREF//00000000001007/TRCD/00190/:86:/RTRN/MS03//EREF/20120123456789//CNTP/NL32INGB0000012345/INGBNL2A/J
        .Janssen///REMI/USTD//Factuurnr 123456 Klantnr 00123/:61:1402200220D1,
        14NDDTEREF//00000000001009/TRCD/01016/:86:/EREF/EV123REP123412T1234//MARF/MND­EV01//CSID/NL32ZZZ999999991234
        //CNTP/NL32INGB0000012345/INGBNL2A/ING Bank N.V. inzake 
        WeB///REMI/USTD//EV123REP123412T1234/:61:1402200220C1,
        45NDDTPREF//00000000001008/TRCD/01000/:86:/PREF/M000000001111111//CSID/NL32ZZZ999999991234//REMI/USTD//TOTAAL 
              1 POSTEN/:61:1402200220D12,75NRTIEREF//00000000001010/TRCD/01315/:86:/RTRN/MS03//EREF/20120501P0123478
              //MARF/MND­120123//CSID/NL32ZZZ999999991234//CNTP/NL32INGB0000012345/INGBNL2A/J.Janssen///REMI/USTD
              //CONTRIBUTIE FEB 2014/:61:1402200220C32,
              00NTRF9001123412341234//00000000001011/TRCD/00108/:86:/EREF/15814016000676480//CNTP/NL32INGB0000012345
              /INGBNL2A/J.Janssen///REMI/STRD/CUR/9001123412341234/:61:1402200220D119,
              00NTRF1070123412341234//00000000001012/TRCD/00108/:86:/EREF/15614016000384600//CNTP/NL32INGB0000012345
              /INGBNL2A/INGBANK NV///REMI/STRD/CUR/1070123412341234/:62F:C140220EUR564,35:64:C140220EUR564,
              35:65:C140221EUR564,35:65:C140224EUR564,35:86:/SUM/4/4/134,46/36,58/­} """

    def __init__(self, session):
        self.dbsession = session

    def create_customer_statement_message(
            self,
            upload_date: datetime = datetime(2020, 11, 1, 15, 15, 15),
            raw_data: str = raw_data,
            transaction_reference_number: str = "P140220000000001",
            related_reference: str = "3948230",
            account_identification: str = "NL69INGB0123456789EUR",
            sequence_number: str = "00000",
            opening_balance: int = 66223,
            closing_balance: int = 56435,
            closing_available_funds: int = 56435,
            forward_available_balance: int = 56435
    ):
        csm = CustomerStatementMessage(
            upload_date=upload_date,
            raw_data=raw_data,
            transaction_reference_number=transaction_reference_number,
            related_reference=related_reference,
            account_identification=account_identification,
            sequence_number=sequence_number,
            opening_balance=opening_balance,
            closing_balance=closing_balance,
            closing_available_funds=closing_available_funds,
            forward_available_balance=forward_available_balance
        )
        self.dbsession.add(csm)
        self.dbsession.flush()
        return csm

