import {useMutation, useQuery} from "@apollo/client";
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
	Spinner,
	Stack,
	useToast,
} from "@chakra-ui/react";
import React, {createContext, useRef} from "react";
import {useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {IOrganisatie} from "../../models";
import {DeleteOrganizationMutation} from "../../services/graphql/mutations";
import {GetOneOrganisatieQuery} from "../../services/graphql/queries";
import BackButton from "../BackButton";
import DeadEndPage from "../DeadEndPage";
import OrganizationDetailView from "./Views/OrganizationDetailView";
import OrganizationRekeningenView from "./Views/OrganizationRekeningenView";

export const OrganizationDetailContext = createContext<any>({});

const OrganizationDetail = () => {
	const {t} = useTranslation();
	const {id} = useParams<{ id }>();
	const {push} = useHistory();
	const toast = useToast();

	const cancelDeleteRef = useRef(null);
	const [deleteDialogOpen, toggleDeleteDialog] = useToggle(false);
	const [isDeleted, toggleDeleted] = useToggle(false);

	const onClickEdit = () => push(Routes.EditOrganization(id));
	const onClickDelete = () => toggleDeleteDialog();

	const {data: orgData, loading: orgLoading, refetch: refetchOrg} = useQuery<{ organisatie: IOrganisatie }>(GetOneOrganisatieQuery, {
		fetchPolicy: "no-cache",
		variables: {id},
	});
	const [deleteOrganization, {loading: deleteLoading}] = useMutation(DeleteOrganizationMutation, {variables: {id}});

	const onCloseDeleteDialog = () => toggleDeleteDialog(false);
	const onConfirmDeleteDialog = () => {
		deleteOrganization().then(() => {
			onCloseDeleteDialog();
			toast({
				title: t("messages.organizations.deleteConfirmMessage", {name: orgData?.organisatie.weergaveNaam}),
				position: "top",
				status: "success",
			});
			toggleDeleted(true);
		})
	};


	const renderPageContent = () => {
		if (!orgData && orgLoading) {
			return (
				<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
					<Spinner />
				</Stack>
			);
		}

		if (orgData) {
			if (!orgData.organisatie) {
				return (
					<Redirect to={Routes.NotFound} />
				)
			}

			if (isDeleted) {
				return (
					<DeadEndPage message={t("messages.organizations.deleteConfirmMessage", {name: orgData.organisatie.weergaveNaam})}>
						<Button colorScheme={"primary"} onClick={() => push(Routes.Organizations)}>{t("actions.backToList")}</Button>
					</DeadEndPage>
				)
			}

			return (
				<Stack spacing={5}>
					<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
						<Heading size={"lg"}>{orgData.organisatie.weergaveNaam}</Heading>

						<AlertDialog isOpen={deleteDialogOpen} leastDestructiveRef={cancelDeleteRef} onClose={onCloseDeleteDialog}>
							<AlertDialogOverlay />
							<AlertDialogContent>
								<AlertDialogHeader fontSize="lg" fontWeight="bold">{t("messages.organizations.deleteTitle")}</AlertDialogHeader>
								<AlertDialogBody>{t("messages.organizations.deleteQuestion", {name: orgData.organisatie.weergaveNaam})}</AlertDialogBody>
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

					<OrganizationDetailView organisatie={orgData.organisatie} />
					<OrganizationRekeningenView organization={orgData.organisatie} />
				</Stack>
			);
		}
	}

	return (
		<OrganizationDetailContext.Provider value={{refresh: refetchOrg}}>
			<BackButton to={Routes.Organizations} />
			{renderPageContent()}
		</OrganizationDetailContext.Provider>
	);
};

export default OrganizationDetail;