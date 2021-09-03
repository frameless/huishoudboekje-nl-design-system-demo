import {ChevronDownIcon} from "@chakra-ui/icons";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {GetOrganisatiesDocument, Organisatie, useDeleteOrganisatieMutation, useGetOrganisatieQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import useToaster from "../../utils/useToaster";
import DeadEndPage from "../DeadEndPage";
import BackButton from "../Layouts/BackButton";
import Page from "../Layouts/Page";
import OrganisatieDetailView from "./Views/OrganisatieDetailView";
import OrganisatieRekeningenView from "./Views/OrganisatieRekeningenView";

const OrganisatieDetail = () => {
	const {t} = useTranslation();
	const {id} = useParams<{id: string}>();
	const {push} = useHistory();
	const toast = useToaster();

	const cancelDeleteRef = useRef(null);
	const [deleteDialogOpen, toggleDeleteDialog] = useToggle(false);
	const [isDeleted, toggleDeleted] = useToggle(false);

	const onClickEdit = () => push(Routes.EditOrganisatie(parseInt(id)));
	const onClickDelete = () => toggleDeleteDialog();

	const $organisatie = useGetOrganisatieQuery({
		fetchPolicy: "no-cache",
		variables: {id: parseInt(id)},
	});
	const [deleteOrganization, {loading: deleteLoading}] = useDeleteOrganisatieMutation({
		variables: {id: parseInt(id)},
		refetchQueries: [
			{query: GetOrganisatiesDocument},
		],
	});
	const onCloseDeleteDialog = () => toggleDeleteDialog(false);

	return (
		<Queryable query={$organisatie} children={({organisatie}: {organisatie: Organisatie}) => {
			const onConfirmDeleteDialog = () => {
				deleteOrganization()
					.then(() => {
						onCloseDeleteDialog();
						toast({
							success: t("messages.organisaties.deleteConfirmMessage", {name: organisatie.kvkDetails?.naam}),
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
					<Redirect to={Routes.NotFound} />
				);
			}

			if (isDeleted) {
				return (
					<DeadEndPage message={t("messages.organisaties.deleteConfirmMessage", {name: organisatie.kvkDetails?.naam})}>
						<Button colorScheme={"primary"} onClick={() => push(Routes.Organisaties)}>{t("actions.backToList")}</Button>
					</DeadEndPage>
				);
			}

			return (
				<Page title={organisatie.kvkDetails?.naam || ""} backButton={<BackButton to={Routes.Organisaties} />} menu={(
					<Menu>
						<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label="Open menu" />
						<MenuList>
							<MenuItem onClick={onClickEdit}>{t("actions.edit")}</MenuItem>
							<MenuItem onClick={onClickDelete}>{t("actions.delete")}</MenuItem>
						</MenuList>
					</Menu>
				)}>
					<AlertDialog isOpen={deleteDialogOpen} leastDestructiveRef={cancelDeleteRef} onClose={onCloseDeleteDialog}>
						<AlertDialogOverlay />
						<AlertDialogContent>
							<AlertDialogHeader fontSize="lg" fontWeight="bold">{t("messages.organisaties.deleteTitle")}</AlertDialogHeader>
							<AlertDialogBody>{t("messages.organisaties.deleteQuestion", {name: organisatie.kvkDetails?.naam})}</AlertDialogBody>
							<AlertDialogFooter>
								<Button ref={cancelDeleteRef} onClick={onCloseDeleteDialog}>{t("actions.cancel")}</Button>
								<Button isLoading={deleteLoading} colorScheme="red" onClick={onConfirmDeleteDialog} ml={3}>{t("actions.delete")}</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					<OrganisatieDetailView organisatie={organisatie} />
					<OrganisatieRekeningenView organisatie={organisatie} />
				</Page>
			);
		}} />
	);
};

export default OrganisatieDetail;