import { 
	Checkbox, 
	CheckboxGroup, 
	FormControl, 
	FormErrorMessage, 
	FormLabel,
	Wrap, 
	WrapItem
} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {DayOfWeek} from "../../generated/graphql";

type WeekDaySelectorProps = {
    isInvalid: boolean,
    isRequired?: boolean,
    value: DayOfWeek[],
    onChange: (day: DayOfWeek[]) => void,
};


const WeekDaySelector: React.FC<WeekDaySelectorProps> = ({isInvalid = false, isRequired = false, value, onChange}) => {
	const {t} = useTranslation();

	return (
		<FormControl flex={1} isInvalid={isInvalid} isRequired={isRequired}>
			<FormLabel>{t("schedule.byDay")}</FormLabel>
			<CheckboxGroup colorScheme={"primary"} defaultValue={[]} value={value || []} onChange={(val: DayOfWeek[]) => onChange(val)}>
				<Wrap>
					<WrapItem><Checkbox value={DayOfWeek.Monday}>Maandag</Checkbox></WrapItem>
					<WrapItem><Checkbox value={DayOfWeek.Tuesday}>Dinsdag</Checkbox></WrapItem>
					<WrapItem><Checkbox value={DayOfWeek.Wednesday}>Woensdag</Checkbox></WrapItem>
					<WrapItem><Checkbox value={DayOfWeek.Thursday}>Donderdag</Checkbox></WrapItem>
					<WrapItem><Checkbox value={DayOfWeek.Friday}>Vrijdag</Checkbox></WrapItem>
					<WrapItem><Checkbox value={DayOfWeek.Saturday}>Zaterdag</Checkbox></WrapItem>
					<WrapItem><Checkbox value={DayOfWeek.Sunday}>Zondag</Checkbox></WrapItem>
				</Wrap>
			</CheckboxGroup>
			<FormErrorMessage>{t("schedule.invalidByDayError")}</FormErrorMessage>
		</FormControl>
	);
};

export default WeekDaySelector;