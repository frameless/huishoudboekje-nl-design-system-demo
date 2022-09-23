from typing import List, Optional

from hhb_backend.service.model.base_model import BaseModel


class CustomerStatementMessage(BaseModel):
    id: int
    upload_date: str
    filename: str
    transaction_reference_number: str
    account_identification: str
    related_reference: Optional[str]
    sequence_number: Optional[str]
    opening_balance: Optional[int]
    closing_balance: Optional[int]
    closing_available_funds: Optional[int]
    forward_available_balance: Optional[int]
    raw_data: str  # appears to be written but never used
    # exposed relations
    bank_transactions: List[int]
