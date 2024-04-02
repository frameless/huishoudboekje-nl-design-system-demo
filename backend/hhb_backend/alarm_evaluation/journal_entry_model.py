from dataclasses import dataclass, asdict


@dataclass
class JournalEntryModel:
    UUID: str
    Amount: int
    Date: int
    IsAutomaticallyReconciled: bool
    AgreementUuid: str
    BankTransactionUuid: str
    StatementUuid: str

    def to_dict(self):
        return asdict(self)
