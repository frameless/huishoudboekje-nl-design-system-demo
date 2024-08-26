from typing import Optional
from hhb_backend.service.model.base_model import BaseModel


class BankTransaction(BaseModel):
    id: int
    uuid: str
    bedrag: int
    is_credit: bool
    is_geboekt: bool
    transactie_datum: str
    customer_statement_message_id: int
    statement_line: str
    information_to_account_owner: str
    tegen_rekening: Optional[str]
