import {Checkbox, CheckboxGroup, FormControl, FormLabel, Stack, StackProps} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import exampleSignalen from "../../../exampleSignalen.json"; // Todo: remove this once we can grab the signalen from the API
import {Burger, Signal} from "../../../generated/graphql";
import {FormLeft, FormRight} from "../../shared/Forms";
import SignalenList from "../../Signalen/SignalenList";

// Todo: remove this temporary type once "Signal" has been renamed to "Signaal" and context was changed.
export type Signaal = Omit<Signal, "context"> & {
	context: any,
	timeUpdated: string,
};

type ActiveSwitch = {
	active: boolean,
	inactive: boolean,
}

const BurgerSignalenView: React.FC<StackProps & {burger: Burger}> = ({burger, ...props}) => {
	const {t} = useTranslation();
	const [filter, setFilter] = useState<ActiveSwitch>({active: true, inactive: false});

	// const signalen: Signal[] = (burger.afspraken || []).map(afspraak => afspraak.alarm?.signaal as Signal) || [];
	const signalen: Signaal[] = exampleSignalen as Signaal[];
	const filteredSignalen: Signaal[] = [
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
				<SignalenList signalen={filteredSignalen} />
			</FormRight>
		</Stack>
	);
};

export default BurgerSignalenView;