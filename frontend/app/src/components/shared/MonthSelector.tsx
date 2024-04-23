import {Checkbox, CheckboxGroup, FormControl, FormErrorMessage, FormLabel, SimpleGrid} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";

type MonthSelectorProps = {
	isInvalid?: boolean,
	isRequired?: boolean,
	value: number[],
	onChange: (months: number[]) => void,
};

const MonthSelector: React.FC<MonthSelectorProps> = ({isInvalid = false, isRequired = false, value, onChange}) => {
	const {t} = useTranslation();

	return (
		<FormControl flex={1} isInvalid={isInvalid} isRequired={isRequired}>
			<FormLabel>{t("schedule.byMonth")}</FormLabel>
			<CheckboxGroup colorScheme={"primary"} defaultValue={[]} value={(value || [])?.map(x => String(x)) || []} onChange={(val: string[]) => onChange(val.map(x => parseInt(x)))}>
				<SimpleGrid columns={2}>
					<Checkbox data-test="checkbox.Jan" value={String(1)}>{t("months.jan")}</Checkbox>
					<Checkbox data-test="checkbox.Jul" value={String(7)}>{t("months.jul")}</Checkbox>
					<Checkbox data-test="checkbox.Feb" value={String(2)}>{t("months.feb")}</Checkbox>
					<Checkbox data-test="checkbox.Aug" value={String(8)}>{t("months.aug")}</Checkbox>
					<Checkbox data-test="checkbox.Mrt" value={String(3)}>{t("months.mrt")}</Checkbox>
					<Checkbox data-test="checkbox.Sep" value={String(9)}>{t("months.sep")}</Checkbox>
					<Checkbox data-test="checkbox.Apr" value={String(4)}>{t("months.apr")}</Checkbox>
					<Checkbox data-test="checkbox.Oct" value={String(10)}>{t("months.oct")}</Checkbox>
					<Checkbox data-test="checkbox.May" value={String(5)}>{t("months.may")}</Checkbox>
					<Checkbox data-test="checkbox.Nov" value={String(11)}>{t("months.nov")}</Checkbox>
					<Checkbox data-test="checkbox.Jun" value={String(6)}>{t("months.jun")}</Checkbox>
					<Checkbox data-test="checkbox.Dec" value={String(12)}>{t("months.dec")}</Checkbox>
				</SimpleGrid>
			</CheckboxGroup>
			<FormErrorMessage>{t("schedule.invalidByMonthError")}</FormErrorMessage>
		</FormControl>
	);
};

export default MonthSelector;