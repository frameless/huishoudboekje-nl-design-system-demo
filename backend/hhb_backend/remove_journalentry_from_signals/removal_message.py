from dataclasses import dataclass, asdict


@dataclass
class RemoveJournalEntryFromSignalMessage:
    JournalEntryIds: list[str]

    def to_dict(self):
        return asdict(self)
