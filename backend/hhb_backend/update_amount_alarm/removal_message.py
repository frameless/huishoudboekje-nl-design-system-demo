from dataclasses import dataclass, asdict


@dataclass
class UpdateAmountAlarmMessage:
    AlarmUuid: str
    Amount: int

    def to_dict(self):
        return asdict(self)
