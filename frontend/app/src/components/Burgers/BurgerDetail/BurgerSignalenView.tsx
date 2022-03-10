import {Checkbox, CheckboxGroup, FormControl, FormLabel, Stack} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Burger, Signaal} from "../../../generated/graphql";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import SignalenListView from "../../Signalen/SignalenListView";

export type ActiveSwitch = {
	active: boolean,
	inactive: boolean,
}

export type Signaal2 = Omit<Signaal, "context"> & {
	context: any
}

const BurgerSignalenView: React.FC<{burger: Burger}> = ({burger}) => {
	const {t} = useTranslation();
	const [filter, setFilter] = useState<ActiveSwitch>({active: true, inactive: false});

	const signalen: Signaal2[] = (burger.afspraken || []).filter(afspraak => afspraak.alarm?.signaal) as Signaal2[];
	const filteredSignalen: Signaal2[] = [
		...signalen.filter(a => filter.active && a.isActive),
		...signalen.filter(a => filter.inactive && !a.isActive),
	];

	return (
		<SectionContainer>
			<Section title={t("forms.burgers.sections.signalen.title")} helperText={t("forms.burgers.sections.signalen.detailText")} left={signalen.length > 0 && (
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
			)}>
				<SignalenListView signalen={filteredSignalen} />
			</Section>
		</SectionContainer>
	);
};

export default BurgerSignalenView;