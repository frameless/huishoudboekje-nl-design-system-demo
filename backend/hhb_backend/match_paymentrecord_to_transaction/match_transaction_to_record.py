from dataclasses import dataclass, asdict
from datetime import date


@dataclass
class MatchTransactionToRecordMessage:
    TransactionInfo: list[dict]

    def to_dict(self):
        return asdict(self)


@dataclass
class MinimalJournalEntry:
    UUID: str
    Date: date
    Amount: int
    IsAutomaticallyReconciled: bool
    AgreementUuid: str
    BankTransactionUuid: str

    def to_dict(self):
        return asdict(self)
