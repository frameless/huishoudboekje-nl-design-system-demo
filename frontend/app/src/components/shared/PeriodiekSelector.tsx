import {FormControl, FormErrorMessage, FormLabel, Radio, RadioGroup, Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";

export enum Periodiek {
    Eenmalig = "eenmalig",
    Periodiek = "herhalend",
}

type PeriodiekSelectorProps = {
    value?: Periodiek,
    isRequired?: boolean,
    isInvalid?: boolean,
    onChange: (value: Periodiek) => void,
};

const PeriodiekSelector: React.FC<PeriodiekSelectorProps> = ({value, isRequired = false, isInvalid = false, onChange}) => {
	const {t} = useTranslation();

	return (
		<FormControl flex={1} isRequired={isRequired} isInvalid={isInvalid}>
			<FormLabel>{t("periodiekSelector.periodiek")}</FormLabel>
			<RadioGroup onChange={(e: Periodiek) => {
				onChange(e);
			}} value={value}>
				<Stack>
					<Radio data-test="alarmForm.once" value={Periodiek.Eenmalig}>{t("schedule.eenmalig")}</Radio>
					<Radio data-test="alarmForm.periodically" value={Periodiek.Periodiek}>{t("schedule.periodiek")}</Radio>
				</Stack>
			</RadioGroup>
			<FormErrorMessage>{t("periodiekSelector.invalidPeriodiekError")}</FormErrorMessage>
		</FormControl>
	);
};

export default PeriodiekSelector;