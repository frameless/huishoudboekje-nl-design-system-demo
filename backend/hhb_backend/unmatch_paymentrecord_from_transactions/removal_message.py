from dataclasses import dataclass, asdict


@dataclass
class UnMatchPaymentRecordsFromTransactionsMessage:
    TransactionIds: list[str]

    def to_dict(self):
        return asdict(self)
