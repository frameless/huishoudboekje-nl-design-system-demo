import time
from dataclasses import dataclass, field, asdict, is_dataclass
from datetime import datetime, timezone

from hhb_backend.graphql.utils.dates import to_date




@dataclass
class TransactionsFilter:
    customerStatementMessageUuids: list[str] = field(default=None)
    ibans: list[str] = field(default=None)
    ids: list[str] = field(default=None)
    keyWords: list[str] = field(default=None)
    minAmount: int = field(default=None)
    maxAmount: int = field(default=None)
    startDate: int = field(default=None)
    endDate: int = field(default=None)
    isReconciled: bool = field(default=None)
    isCredit: int = field(default=None)

    def to_dict(self):
        return asdict(self)
    

@dataclass
class PaginationRequest:
    take: int = field(default=None)
    skip: int = field(default=None)

    def to_dict(self):
        return asdict(self)


@dataclass
class GetTransactionsMessage:
    filter: TransactionsFilter = field(default=None)

    def to_dict(self):
        return asdict(self)
    
@dataclass
class GetTransactionsPagedMessage:
    pagination: PaginationRequest = field(default=None)
    filter: TransactionsFilter = field(default=None)

    def to_dict(self):
        return asdict(self)
