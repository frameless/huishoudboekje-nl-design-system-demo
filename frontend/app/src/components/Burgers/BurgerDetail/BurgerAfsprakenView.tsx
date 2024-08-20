import {Box, Checkbox, CheckboxGroup, FormControl, FormLabel, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Afspraak, Burger} from "../../../generated/graphql";
import {isAfspraakActive} from "../../../utils/things";
import AfspraakTableRow from "../../Afspraken/AfspraakTableRow";
import AddButton from "../../shared/AddButton";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import d from "../../../utils/dayjs";

type ActiveSwitch = {
	active: boolean,
	inactive: boolean,
}

const BurgerAfsprakenView: React.FC<{burger: Burger}> = ({burger}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {id, afspraken = []} = burger;
	const [filter, setFilter] = useState<ActiveSwitch>({active: true, inactive: false});
	const navigate = useNavigate();

	const sortedAfspraken = [
		...afspraken.filter(a => filter.active && isAfspraakActive(a) && !a.credit).sort((a, b) => parseFloat(a.bedrag) >= parseFloat(b.bedrag) ? -1 : 1),
		...afspraken.filter(a => filter.active && isAfspraakActive(a) && a.credit).sort((a, b) => a.bedrag >= b.bedrag ? -1 : 1),
		...afspraken.filter(a => filter.inactive && !isAfspraakActive(a) && !a.credit).sort((a, b) => parseFloat(a.bedrag) >= parseFloat(b.bedrag) ? -1 : 1),
		...afspraken.filter(a => filter.inactive && !isAfspraakActive(a) && a.credit).sort((a, b) => a.bedrag >= b.bedrag ? -1 : 1),
	];

	function sortAfspraken(a: Afspraak, b: Afspraak) {
		const aStartDate = a.betaalinstructie?.startDate
		const bStartDate = b.betaalinstructie?.startDate

		const aIsOneTimeAgreement = aStartDate !== undefined && aStartDate === a.betaalinstructie?.endDate
		const bIsOneTimeAgreement = bStartDate !== undefined &&  bStartDate === b.betaalinstructie?.endDate

		// First, sort by the one time agreements
		if (aIsOneTimeAgreement !== bIsOneTimeAgreement) {
			return aIsOneTimeAgreement ? -1 : 1;
		}

		// If both are one time agreements sort by date
		if (aIsOneTimeAgreement && bIsOneTimeAgreement) {
			return  d(aStartDate).unix() - d(bStartDate).unix() ;
		}

		//If not one time agreement keep same order
		return 0;
    }


	return (
		<SectionContainer>
			<Section title={t("forms.burgers.sections.agreements.title")} helperText={t("forms.burgers.sections.agreements.detailText")} left={afspraken.length > 0 && (
				<FormControl>
					<FormLabel>{t("global.actions.filter")}</FormLabel>
					<CheckboxGroup defaultValue={["active"]} onChange={(val) => {
						setFilter(() => ({
							active: val.includes("active"),
							inactive: val.includes("inactive"),
						}));
					}}>
						<Stack>
							<Checkbox value={"active"}>{t("afspraken.showActive")}</Checkbox>
							<Checkbox value={"inactive"}>{t("afspraken.showInActive")}</Checkbox>
						</Stack>
					</CheckboxGroup>
				</FormControl>
			)}>
				{sortedAfspraken.length > 0 && (
					<Table size={"sm"} variant={"noLeftPadding"}>
						<Thead>
							<Tr>
								<Th>{t("afspraken.tegenpartij")}</Th>
								{!isMobile && <Th>{t("afspraken.omschrijving")}</Th>}
								{!isMobile && <Th>{t("afspraken.nextBooking")}</Th>}
								<Th textAlign={"right"}>{t("afspraken.bedrag")}</Th>
								<Th />
							</Tr>
						</Thead>
						<Tbody>
							{sortedAfspraken.length === 0 && (
								<Tr>
									<Td colSpan={10}>
										<Text>{t("afspraken.noResults")}</Text>
									</Td>
								</Tr>
							)}
							{sortedAfspraken.length > 0 && sortedAfspraken.sort(sortAfspraken).map((a) => (
								<AfspraakTableRow key={a.id} data-id={a.id} afspraak={a} py={2} />
							))}
						</Tbody>
					</Table>
				)}

				{id && (
					<Box>
						<AddButton data-test="button.Add" onClick={() => navigate(AppRoutes.CreateBurgerAfspraak(String(id)))} />
					</Box>
				)}
			</Section>
		</SectionContainer>
	);
};

export default BurgerAfsprakenView;
