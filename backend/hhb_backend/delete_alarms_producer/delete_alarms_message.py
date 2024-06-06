from dataclasses import dataclass, asdict


@dataclass
class DeleteAlarms:
    Ids: list[str]
    DeleteSignals: bool
    CitizenIds : list[str]

    def to_dict(self):
        return asdict(self)
