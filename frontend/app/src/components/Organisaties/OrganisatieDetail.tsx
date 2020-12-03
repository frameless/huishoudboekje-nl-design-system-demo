import {ChevronDownIcon} from "@chakra-ui/icons";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	Heading,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Stack,
	useToast,
} from "@chakra-ui/react";
import React, {createContext, useRef} from "react";
import {useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {Organisatie, useDeleteOrganisatieMutation, useGetOneOrganisatieQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import BackButton from "../BackButton";
import DeadEndPage from "../DeadEndPage";
import OrganisatieDetailView from "./Views/OrganisatieDetailView";
import OrganisatieRekeningenView from "./Views/OrganisatieRekeningenView";

export const OrganizationDetailContext = createContext<any>({});

const OrganisatieDetail = () => {
	const {t} = useTranslation();
	const {id} = useParams<{ id: string }>();
	const {push} = useHistory();
	const toast = useToast();

	const cancelDeleteRef = useRef(null);
	const [deleteDialogOpen, toggleDeleteDialog] = useToggle(false);
	const [isDeleted, toggleDeleted] = useToggle(false);

	const onClickEdit = () => push(Routes.EditOrganisatie(parseInt(id)));
	const onClickDelete = () => toggleDeleteDialog();

	const $organisatie = useGetOneOrganisatieQuery({
		fetchPolicy: "no-cache",
		variables: {id: parseInt(id)},
	});
	const [deleteOrganization, {loading: deleteLoading}] = useDeleteOrganisatieMutation({variables: {id: parseInt(id)}});
	const onCloseDeleteDialog = () => toggleDeleteDialog(false);

	return (
		<OrganizationDetailContext.Provider value={{refresh: $organisatie.refetch}}>
			<BackButton to={Routes.Organisaties} />

			<Queryable query={$organisatie}>{({organisatie}: { organisatie: Organisatie }) => {
				const onConfirmDeleteDialog = () => {
					deleteOrganization().then(() => {
						onCloseDeleteDialog();
						toast({
							title: t("messages.organizations.deleteConfirmMessage", {name: organisatie.weergaveNaam}),
							position: "top",
							status: "success",
						});
						toggleDeleted(true);
					})
				};

				if (!organisatie) {
					return (
						<Redirect to={Routes.NotFound} />
					);
				}

				if (isDeleted) {
					return (
						<DeadEndPage message={t("messages.organizations.deleteConfirmMessage", {name: organisatie.weergaveNaam})}>
							<Button colorScheme={"primary"} onClick={() => push(Routes.Organisaties)}>{t("actions.backToList")}</Button>
						</DeadEndPage>
					)
				}

				return (
					<Stack spacing={5}>
						<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
							<Heading size={"lg"}>{organisatie.weergaveNaam}</Heading>

							<AlertDialog isOpen={deleteDialogOpen} leastDestructiveRef={cancelDeleteRef} onClose={onCloseDeleteDialog}>
								<AlertDialogOverlay />
								<AlertDialogContent>
									<AlertDialogHeader fontSize="lg" fontWeight="bold">{t("messages.organizations.deleteTitle")}</AlertDialogHeader>
									<AlertDialogBody>{t("messages.organizations.deleteQuestion", {name: organisatie.weergaveNaam})}</AlertDialogBody>
									<AlertDialogFooter>
										<Button ref={cancelDeleteRef} onClick={onCloseDeleteDialog}>{t("actions.cancel")}</Button>
										<Button isLoading={deleteLoading} colorScheme="red" onClick={onConfirmDeleteDialog} ml={3}>{t("actions.delete")}</Button>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>

							<Menu>
								<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label="Open menu" />
								<MenuList>
									<MenuItem onClick={onClickEdit}>{t("actions.edit")}</MenuItem>
									<MenuItem onClick={onClickDelete}>{t("actions.delete")}</MenuItem>
								</MenuList>
							</Menu>
						</Stack>

						<OrganisatieDetailView organisatie={organisatie} />
						<OrganisatieRekeningenView organisatie={organisatie} />
					</Stack>
				);
			}}
			</Queryable>
		</OrganizationDetailContext.Provider>
	);
};

export default OrganisatieDetail;