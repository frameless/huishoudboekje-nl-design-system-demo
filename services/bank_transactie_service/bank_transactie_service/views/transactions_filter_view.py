""" MethodView for /afspraken/search path """
from core_service.utils import valid_date
from core_service.views.basic_view.basic_filter_view import BasicFilterView
from models.bank_transaction import BankTransaction
from sqlalchemy import func, and_


class BanktransactionFilterView(BasicFilterView):
    """ Methods for /banktransactions/filter path """

    model = "banktransactions"

    def set_basic_query(self):
        self.query = BankTransaction.query.order_by(
            BankTransaction.transactie_datum.desc())

    def add_filter_options(self, filter_options, query):
        ids = filter_options.get("ids", None)
        min_bedrag = filter_options.get("min_bedrag", None)
        max_bedrag = filter_options.get("max_bedrag", None)
        start_date = filter_options.get("start_date", None)
        end_date = filter_options.get("end_date", None)
        ibans = filter_options.get("ibans", None)
        only_booked = filter_options.get("only_booked", None)
        only_credit = filter_options.get("only_credit", None)
        zoektermen = filter_options.get("zoektermen", None)

        new_query = query
        if ids is not None:
            new_query = new_query.filter(BankTransaction.id.in_(ids))

        if min_bedrag is not None:
            new_query = new_query.filter(
                func.abs(BankTransaction.bedrag) >= min_bedrag)

        if max_bedrag is not None:
            new_query = new_query.filter(
                func.abs(BankTransaction.bedrag) <= max_bedrag)

        if start_date is not None and valid_date(start_date):
            new_query = new_query.filter(
                BankTransaction.transactie_datum >= start_date)

        if end_date is not None and valid_date(end_date):
            new_query = new_query.filter(
                end_date >= BankTransaction.transactie_datum)

        if ibans is not None:
            new_query = new_query.filter(
                BankTransaction.tegen_rekening.in_(ibans))

        if only_booked is not None:
            new_query = new_query.filter(
                BankTransaction.is_geboekt.is_(only_booked))

        if only_credit is not None:
            new_query = new_query.filter(
                BankTransaction.is_credit.is_(only_credit))

        if zoektermen:
            clauses = [func.lower(BankTransaction.information_to_account_owner).like(
                f"%{term.lower()}%") for term in zoektermen]
            new_query = new_query.filter(and_(*clauses))

        return new_query
