from dataclasses import dataclass, asdict


@dataclass
class UpdateEndDateAlarmMessage:
    AlarmUuid: str
    EndDateUnix: int

    def to_dict(self):
        return asdict(self)
