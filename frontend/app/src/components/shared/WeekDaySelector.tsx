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

type WeekDaySelectorProps = {
    isInvalid: boolean,
    isRequired?: boolean,
	value: number[],
	onChange: (day: number[]) => void,
};

const WeekDaySelector: React.FC<WeekDaySelectorProps> = ({isInvalid = false, isRequired = false, value, onChange}) => {
	const {t} = useTranslation();

	return (
		<FormControl flex={1} isInvalid={isInvalid} isRequired={isRequired}>
			<FormLabel>{t("schedule.byDay")}</FormLabel>
			<CheckboxGroup colorScheme={"primary"} defaultValue={[]} value={value || []} onChange={(val: number[]) => onChange(correctValuesToInt(val))}>
				<Wrap>
					<WrapItem><Checkbox value={1}>Maandag</Checkbox></WrapItem>
					<WrapItem><Checkbox value={2}>Dinsdag</Checkbox></WrapItem>
					<WrapItem><Checkbox value={3}>Woensdag</Checkbox></WrapItem>
					<WrapItem><Checkbox value={4}>Donderdag</Checkbox></WrapItem>
					<WrapItem><Checkbox value={5}>Vrijdag</Checkbox></WrapItem>
					<WrapItem><Checkbox value={6}>Zaterdag</Checkbox></WrapItem>
					<WrapItem><Checkbox value={7}>Zondag</Checkbox></WrapItem>
				</Wrap>
			</CheckboxGroup>
			<FormErrorMessage>{t("schedule.invalidByDayError")}</FormErrorMessage>
		</FormControl>
	);
};

const correctValuesToInt = (values: any[]) => {
	return values.map(value => {
		return +value
	})
}

export default WeekDaySelector;