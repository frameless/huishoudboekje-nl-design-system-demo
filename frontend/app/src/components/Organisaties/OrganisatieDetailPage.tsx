import {Box, Button, Grid, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, useBreakpointValue, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {Afdeling, GetOrganisatiesDocument, Organisatie, useDeleteOrganisatieMutation, useGetOrganisatieQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {maxOrganisatieNaamLengthBreakpointValues, truncateText} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import Alert from "../shared/Alert";
import BackButton from "../shared/BackButton";
import DashedAddButton from "../shared/DashedAddButton";
import MenuIcon from "../shared/MenuIcon";
import Page from "../shared/Page";
import AfdelingListItem from "./AfdelingListItem";
import CreateAfdelingModal from "./CreateAfdelingModal";
import OrganisatieDetailView from "./OrganisatieDetailView";

const OrganisatieDetailPage = () => {
	const {t} = useTranslation();
	const {id = ""} = useParams<{id: string}>();
	const navigate = useNavigate();
	const toast = useToaster();
	const addAfdelingModal = useDisclosure();
	const deleteAlert = useDisclosure();
	const maxOrganisatieNaamLength = useBreakpointValue(maxOrganisatieNaamLengthBreakpointValues);
	const $organisatie = useGetOrganisatieQuery({
		variables: {id: parseInt(id)},
	});
	const [deleteOrganisatie, {loading: deleteLoading}] = useDeleteOrganisatieMutation({
		variables: {id: parseInt(id)},
		refetchQueries: [
			{query: GetOrganisatiesDocument},
		],
	});

	return (
		<Queryable query={$organisatie} children={({organisatie}: {organisatie: Organisatie}) => {
			const onConfirmDeleteDialog = () => {
				deleteOrganisatie()
					.then(() => {
						deleteAlert.onClose();
						toast({
							success: t("messages.organisaties.deleteConfirmMessage"),
						});
						navigate(AppRoutes.Organisaties);
					})
					.catch(err => {
						console.error(err);
						toast({
							error: err.message,
						});
					});
			};

			if (!organisatie) {
				return (
					<Navigate to={AppRoutes.NotFound} replace />
				);
			}

			const afdelingen: Afdeling[] = organisatie.afdelingen || [];
			return (
				<Page title={truncateText(organisatie.naam || "", maxOrganisatieNaamLength)} backButton={<BackButton to={AppRoutes.Organisaties} />}
					menu={(
						<Menu>
							<IconButton as={MenuButton} icon={<MenuIcon />} variant={"solid"} aria-label={"Open menu"} />
							<MenuList>
								<MenuItem onClick={() => navigate(AppRoutes.EditOrganisatie(id))}>{t("global.actions.edit")}</MenuItem>
								<MenuItem onClick={() => deleteAlert.onOpen()}>{t("global.actions.delete")}</MenuItem>
							</MenuList>
						</Menu>
					)}>
					{addAfdelingModal.isOpen && (
						<CreateAfdelingModal organisatie={organisatie} onClose={addAfdelingModal.onClose} />
					)}
					{deleteAlert.isOpen && (
						<Alert
							title={t("messages.organisaties.deleteTitle")}
							cancelButton={true}
							confirmButton={(
								<Button isLoading={deleteLoading} colorScheme={"red"} onClick={onConfirmDeleteDialog} ml={3}>
									{t("global.actions.delete")}
								</Button>
							)}
							onClose={() => deleteAlert.onClose()}
						>
							{t("messages.organisaties.deleteQuestion", {name: organisatie.naam})}
						</Alert>
					)}

					<OrganisatieDetailView organisatie={organisatie} />

					<Heading size={"md"}>{t("afdelingen")}</Heading>
					<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={5}>
						<Box data-test="button.addDepartment">
							<DashedAddButton onClick={() => addAfdelingModal.onOpen()} />
						</Box>

						{[...afdelingen].sort((a, b) => { // Sort ascending by name
							return (a.naam || "") < (b.naam || "") ? -1 : 1;
						}).map(afdeling => (
							<AfdelingListItem key={afdeling.id} afdeling={afdeling} />
						))}
					</Grid>
				</Page>
			);
		}} />
	);
};

export default OrganisatieDetailPage;
