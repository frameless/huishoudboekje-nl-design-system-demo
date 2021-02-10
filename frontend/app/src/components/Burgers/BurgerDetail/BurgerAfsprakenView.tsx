import {AddIcon} from "@chakra-ui/icons";
import {Box, Button, Stack, StackProps, Table, Tbody, Th, Thead, Tr, useBreakpointValue, useToast} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../../config/routes";
import {Gebruiker, useDeleteAfspraakMutation} from "../../../generated/graphql";
import AfspraakTableRow from "../../Afspraken/AfspraakTableRow";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";

const BurgerAfsprakenView: React.FC<StackProps & { burger: Gebruiker, refetch: VoidFunction }> = ({burger, refetch, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const toast = useToast();
	const {push} = useHistory();
	const {afspraken} = burger;

	const onClickAddAfspraakButton = () => {
		if (burger.id) {
			push(Routes.CreateBurgerAfspraken(burger.id))
		}
	};

	const [deleteAfspraak] = useDeleteAfspraakMutation();
	const onDeleteAfspraak = (id) => {
		deleteAfspraak({variables: {id}}).then(() => {
			toast({
				title: t("messages.agreements.deleteConfirmMessage"),
				position: "top",
				status: "success",
			});
			refetch();
		}).catch(err => {
			console.error(err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				description: t("messages.genericError.description"),
				title: t("messages.genericError.title")
			});
		});
	};

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
								<Th>{t("actions.actions")}</Th>
							</Tr>
						</Thead>
						<Tbody>
							{afspraken.filter(a => !a.credit).sort((a, b) => parseFloat(a.bedrag) >= parseFloat(b.bedrag) ? -1 : 1).map((a, i) => (
								<AfspraakTableRow key={a.id} data-id={a.id} afspraak={a} py={2} onDelete={(id: number) => onDeleteAfspraak(id)} />
							))}
							{afspraken.filter(a => a.credit).sort((a, b) => a.bedrag >= b.bedrag ? -1 : 1).map((a, i) => (
								<AfspraakTableRow key={a.id} data-id={a.id} afspraak={a} py={2} onDelete={(id: number) => onDeleteAfspraak(id)} />
							))}
						</Tbody>
					</Table>
				</>)}

				<Box>
					<Button leftIcon={<AddIcon />} colorScheme={"primary"} size={"sm"} onClick={onClickAddAfspraakButton}>{t("actions.add")}</Button>
				</Box>
			</FormRight>
		</Stack>
	);
};

export default BurgerAfsprakenView;