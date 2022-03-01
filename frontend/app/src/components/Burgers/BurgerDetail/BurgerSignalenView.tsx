import {Checkbox, CheckboxGroup, FormControl, FormLabel, Stack, StackProps} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import exampleSignalen from "../../../exampleSignalen.json";
import {Burger, Signaal} from "../../../generated/graphql";
import {FormLeft, FormRight} from "../../shared/Forms";
import SignalenListView from "../../Signalen/SignalenListView";

export type ActiveSwitch = {
	active: boolean,
	inactive: boolean,
}

export type Signaal2 = Omit<Signaal, "context"> & {
	context: any
}

const BurgerSignalenView: React.FC<StackProps & {burger: Burger}> = ({burger, ...props}) => {
	const {t} = useTranslation();
	const [filter, setFilter] = useState<ActiveSwitch>({active: true, inactive: false});

	const signalen: Signaal2[] = exampleSignalen as Signaal2[];
	// const signalen: Signaal2[] = (burger.afspraken || []).filter(afspraak => afspraak.alarm?.signaal) as Signaal2[];
	const filteredSignalen: Signaal2[] = [
		...signalen.filter(a => filter.active && a.isActive),
		...signalen.filter(a => filter.inactive && !a.isActive),
	];

	return (
		<Stack spacing={2} mb={1} direction={["column", "row"]} {...props}>
			<FormLeft title={t("forms.burgers.sections.signalen.title")} helperText={t("forms.burgers.sections.signalen.detailText")}>
				{signalen.length > 0 && (
					<FormControl>
						<FormLabel>{t("global.actions.filter")}</FormLabel>
						<CheckboxGroup defaultValue={["active"]} onChange={(val) => {
							setFilter(() => ({
								active: val.includes("active"),
								inactive: val.includes("inactive"),
							}));
						}}>
							<Stack>
								<Checkbox value={"active"}>{t("signalen.showActive")}</Checkbox>
								<Checkbox value={"inactive"}>{t("signalen.showInActive")}</Checkbox>
							</Stack>
						</CheckboxGroup>
					</FormControl>
				)}
			</FormLeft>
			<FormRight>
				<SignalenListView signalen={filteredSignalen} />
			</FormRight>
		</Stack>
	);
};

export default BurgerSignalenView;