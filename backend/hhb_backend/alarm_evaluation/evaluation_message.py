from dataclasses import dataclass, asdict
from hhb_backend.alarm_evaluation.journal_entry_model import JournalEntryModel


@dataclass
class CheckAlarmsReconciledMessage:
    AgreementToAlarm: dict[str, str]
    ReconciledJournalEntries: list[dict]
    AlarmToCitizen: dict[str, str]

    def to_dict(self):
        return asdict(self)
    
@dataclass
class CheckSaldosMessage:
    AffectedCitizens: list[str]
    SaldoThreshold: int

    def to_dict(self):
        return asdict(self)

