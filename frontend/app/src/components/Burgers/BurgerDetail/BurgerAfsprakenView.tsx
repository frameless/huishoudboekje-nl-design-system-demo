import {AddIcon} from "@chakra-ui/icons";
import {Box, Button, Stack, StackProps, Table, Tbody, Th, Thead, Tr, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import Routes from "../../../config/routes";
import {Burger} from "../../../generated/graphql";
import AfspraakTableRow from "../../Afspraken/AfspraakTableRow";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";

const BurgerAfsprakenView: React.FC<StackProps & {burger: Burger, refetch: VoidFunction}> = ({burger, refetch, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {id, afspraken} = burger;

	return (
		<Stack direction={["column", "row"]} {...props}>
			<FormLeft title={t("forms.burgers.sections.agreements.title")} helperText={t("forms.burgers.sections.agreements.detailText")} />
			<FormRight justifyContent={"center"}>
				{afspraken && afspraken.length > 0 && (<>
					<Table size={"sm"}>
						<Thead>
							<Tr>
								<Th>{t("agreements.tegenpartij")}</Th>
								{!isMobile && <Th>{t("agreements.omschrijving")}</Th>}
								<Th textAlign={"right"}>{t("agreements.bedrag")}</Th>
								<Th />
							</Tr>
						</Thead>
						<Tbody>
							{afspraken.filter(a => !a.credit).sort((a, b) => parseFloat(a.bedrag) >= parseFloat(b.bedrag) ? -1 : 1).map((a, i) => (
								<AfspraakTableRow key={a.id} data-id={a.id} afspraak={a} py={2} />
							))}
							{afspraken.filter(a => a.credit).sort((a, b) => a.bedrag >= b.bedrag ? -1 : 1).map((a, i) => (
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