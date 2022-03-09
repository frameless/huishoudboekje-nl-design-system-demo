import {Checkbox, CheckboxGroup, FormControl, FormErrorMessage, FormLabel, Wrap, WrapItem} from "@chakra-ui/react";
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
				<Wrap>
					<WrapItem><Checkbox value={String(1)}>{t("months.jan")}</Checkbox></WrapItem>
					<WrapItem><Checkbox value={String(2)}>{t("months.feb")}</Checkbox></WrapItem>
					<WrapItem><Checkbox value={String(3)}>{t("months.mrt")}</Checkbox></WrapItem>
					<WrapItem><Checkbox value={String(4)}>{t("months.apr")}</Checkbox></WrapItem>
					<WrapItem><Checkbox value={String(5)}>{t("months.may")}</Checkbox></WrapItem>
					<WrapItem><Checkbox value={String(6)}>{t("months.jun")}</Checkbox></WrapItem>
					<WrapItem><Checkbox value={String(7)}>{t("months.jul")}</Checkbox></WrapItem>
					<WrapItem><Checkbox value={String(8)}>{t("months.aug")}</Checkbox></WrapItem>
					<WrapItem><Checkbox value={String(9)}>{t("months.sep")}</Checkbox></WrapItem>
					<WrapItem><Checkbox value={String(10)}>{t("months.oct")}</Checkbox></WrapItem>
					<WrapItem><Checkbox value={String(11)}>{t("months.nov")}</Checkbox></WrapItem>
					<WrapItem><Checkbox value={String(12)}>{t("months.dec")}</Checkbox></WrapItem>
				</Wrap>
			</CheckboxGroup>
			<FormErrorMessage>{t("schedule.invalidByMonthError")}</FormErrorMessage>
		</FormControl>
	);
};

export default MonthSelector;