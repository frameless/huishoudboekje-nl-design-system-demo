import {AddIcon} from "@chakra-ui/icons";
import {Box, Button, Checkbox, CheckboxGroup, FormControl, FormLabel, Stack, StackProps, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import Routes from "../../../config/routes";
import {Burger} from "../../../generated/graphql";
import {isAfspraakActive} from "../../../utils/things";
import AfspraakTableRow from "../../Afspraken/AfspraakTableRow";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";

type ActiveSwitch = {
	active: boolean,
	inactive: boolean,
}

const BurgerAfsprakenView: React.FC<StackProps & {burger: Burger, refetch: VoidFunction}> = ({burger, refetch, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {id, afspraken = []} = burger;
	const [filter, setFilter] = useState<ActiveSwitch>({active: true, inactive: false});

	const sortedAfspraken = [
		...afspraken.filter(a => filter.active && isAfspraakActive(a) && !a.credit).sort((a, b) => parseFloat(a.bedrag) >= parseFloat(b.bedrag) ? -1 : 1),
		...afspraken.filter(a => filter.active && isAfspraakActive(a) && a.credit).sort((a, b) => a.bedrag >= b.bedrag ? -1 : 1),
		...afspraken.filter(a => filter.inactive && !isAfspraakActive(a) && !a.credit).sort((a, b) => parseFloat(a.bedrag) >= parseFloat(b.bedrag) ? -1 : 1),
		...afspraken.filter(a => filter.inactive && !isAfspraakActive(a) && a.credit).sort((a, b) => a.bedrag >= b.bedrag ? -1 : 1),
	];

	return (
		<Stack direction={["column", "row"]} {...props}>
			<FormLeft title={t("forms.burgers.sections.agreements.title")} helperText={t("forms.burgers.sections.agreements.detailText")}>
				{sortedAfspraken.length > 0 && (
					<FormControl>
						<FormLabel>{t("actions.filter")}</FormLabel>
						<CheckboxGroup defaultValue={["active"]} onChange={(val) => {
							setFilter(() => ({
								active: val.includes("active"),
								inactive: val.includes("inactive"),
							}));
						}}>
							<Stack>
								<Checkbox value={"active"}>{t("afspraak.showActive")}</Checkbox>
								<Checkbox value={"inactive"}>{t("afspraak.showInActive")}</Checkbox>
							</Stack>
						</CheckboxGroup>
					</FormControl>
				)}
			</FormLeft>
			<FormRight justify={"start"}>
				{sortedAfspraken.length > 0 && (<>
					<Table size={"sm"} variant={"noLeftPadding"}>
						<Thead>
							<Tr>
								<Th>{t("afspraken.tegenpartij")}</Th>
								{!isMobile && <Th>{t("afspraken.omschrijving")}</Th>}
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
							{sortedAfspraken.length > 0 && sortedAfspraken.map((a, i) => (
								<AfspraakTableRow key={a.id} data-id={a.id} afspraak={a} py={2} />
							))}
						</Tbody>
					</Table>
				</>)}

				{id && (
					<Box>
						<NavLink to={Routes.CreateBurgerAfspraken(id)}>
							<Button leftIcon={<AddIcon />} colorScheme={"primary"} size={"sm"}>{t("actions.add")}</Button>
						</NavLink>
					</Box>
				)}
			</FormRight>
		</Stack>
	);
};

export default BurgerAfsprakenView;