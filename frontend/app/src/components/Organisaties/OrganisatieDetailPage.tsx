import {AddIcon, ChevronDownIcon} from "@chakra-ui/icons";
import {Box, Button, Grid, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, useBreakpointValue, useDisclosure} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {Afdeling, GetOrganisatiesDocument, Organisatie, useDeleteOrganisatieMutation, useGetOrganisatieQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {maxOrganisatieNaamLengthBreakpointValues, truncateText} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import Alert from "../shared/Alert";
import BackButton from "../shared/BackButton";
import DeadEndPage from "../shared/DeadEndPage";
import Page from "../shared/Page";
import {DeprecatedSection} from "../shared/Section";
import AfdelingListItem from "./AfdelingListItem";
import CreateAfdelingModal from "./CreateAfdelingModal";
import OrganisatieDetailView from "./Views/OrganisatieDetailView";

const OrganisatieDetailPage = () => {
	const {t} = useTranslation();
	const {id = ""} = useParams<{id: string}>();
	const navigate = useNavigate();
	const toast = useToaster();
	const addAfdelingModal = useDisclosure();
	const deleteAlert = useDisclosure();
	const maxOrganisatieNaamLength = useBreakpointValue(maxOrganisatieNaamLengthBreakpointValues);

	const [isDeleted, toggleDeleted] = useState(false);

	const onClickEdit = () => navigate(AppRoutes.EditOrganisatie(parseInt(id)));
	const onClickDelete = () => deleteAlert.onOpen();

	const $organisatie = useGetOrganisatieQuery({
		variables: {id: parseInt(id)},
	});
	const [deleteOrganisatie, {loading: deleteLoading}] = useDeleteOrganisatieMutation({
		variables: {id: parseInt(id)},
		refetchQueries: [
			{query: GetOrganisatiesDocument},
		],
	});
	const onCloseDeleteDialog = () => deleteAlert.onClose();

	return (
		<Queryable query={$organisatie} children={({organisatie}: {organisatie: Organisatie}) => {
			const onConfirmDeleteDialog = () => {
				deleteOrganisatie()
					.then(() => {
						onCloseDeleteDialog();
						toast({
							success: t("messages.organisaties.deleteConfirmMessage", {name: organisatie.naam}),
						});
						toggleDeleted(true);
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

			if (isDeleted) {
				return (
					<DeadEndPage message={t("messages.organisaties.deleteConfirmMessage", {name: organisatie.naam})}>
						<Button colorScheme={"primary"} onClick={() => navigate(AppRoutes.Organisaties)}>{t("global.actions.backToList")}</Button>
					</DeadEndPage>
				);
			}

			const afdelingen: Afdeling[] = organisatie.afdelingen || [];
			return (
				<Page title={truncateText(organisatie.naam || "", maxOrganisatieNaamLength)} backButton={<BackButton to={AppRoutes.Organisaties} />}
					menu={(
						<Menu>
							<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} />
							<MenuList>
								<MenuItem onClick={onClickEdit}>{t("global.actions.edit")}</MenuItem>
								<MenuItem onClick={onClickDelete}>{t("global.actions.delete")}</MenuItem>
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
							onClose={onCloseDeleteDialog}
						>
							{t("messages.organisaties.deleteQuestion", {name: organisatie.naam})}
						</Alert>
					)}

					<DeprecatedSection>
						<OrganisatieDetailView organisatie={organisatie} />
					</DeprecatedSection>

					<Heading size={"md"}>{t("afdelingen")}</Heading>
					<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={5}>
						<Box>
							<Button colorScheme={"primary"} borderStyle={"dashed"} variant={"outline"} leftIcon={<AddIcon />}
								w={"100%"} h={"100%"} onClick={() => addAfdelingModal.onOpen()} borderRadius={5}
								p={5}>{t("global.actions.add")}</Button>
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