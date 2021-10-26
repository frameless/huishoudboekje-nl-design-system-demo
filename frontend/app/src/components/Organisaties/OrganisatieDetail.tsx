import {AddIcon, ChevronDownIcon} from "@chakra-ui/icons";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Box,
	Button,
	Grid,
	Heading,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	useBreakpointValue,
} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {Afdeling, GetOrganisatiesDocument, Organisatie, useDeleteOrganisatieMutation, useGetOrganisatieQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {maxOrganisatieNaamLengthBreakpointValues, truncateText} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import DeadEndPage from "../DeadEndPage";
import BackButton from "../Layouts/BackButton";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";
import AfdelingListItem from "./AfdelingListItem";
import OrganisatieDetailView from "./Views/OrganisatieDetailView";

const OrganisatieDetail = () => {
	const {t} = useTranslation();
	const {id} = useParams<{id: string}>();
	const {push} = useHistory();
	const toast = useToaster();
	const maxOrganisatieNaamLength = useBreakpointValue(maxOrganisatieNaamLengthBreakpointValues);

	const cancelDeleteRef = useRef(null);
	const [deleteDialogOpen, toggleDeleteDialog] = useToggle(false);
	const [isDeleted, toggleDeleted] = useToggle(false);

	const onClickEdit = () => push(Routes.EditOrganisatie(parseInt(id)));
	const onClickDelete = () => toggleDeleteDialog();

	const $organisatie = useGetOrganisatieQuery({
		variables: {id: parseInt(id)},
	});
	const [deleteOrganisatie, {loading: deleteLoading}] = useDeleteOrganisatieMutation({
		variables: {id: parseInt(id)},
		refetchQueries: [
			{query: GetOrganisatiesDocument},
		],
	});
	const onCloseDeleteDialog = () => toggleDeleteDialog(false);

	return (
		<Queryable query={$organisatie} children={({organisatie}: {organisatie: Organisatie}) => {
			const afdelingen: Afdeling[] = organisatie.afdelingen || [];
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
					<Redirect to={Routes.NotFound} />
				);
			}

			if (isDeleted) {
				return (
					<DeadEndPage message={t("messages.organisaties.deleteConfirmMessage", {name: organisatie.naam})}>
						<Button colorScheme={"primary"} onClick={() => push(Routes.Organisaties)}>{t("global.actions.backToList")}</Button>
					</DeadEndPage>
				);
			}

			return (
				<Page title={truncateText(organisatie.naam || "", maxOrganisatieNaamLength)} backButton={<BackButton to={Routes.Organisaties} />} menu={(
					<Menu>
						<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label="Open menu" />
						<MenuList>
							<MenuItem onClick={onClickEdit}>{t("global.actions.edit")}</MenuItem>
							<MenuItem onClick={onClickDelete}>{t("global.actions.delete")}</MenuItem>
						</MenuList>
					</Menu>
				)}>
					<AlertDialog isOpen={deleteDialogOpen} leastDestructiveRef={cancelDeleteRef} onClose={onCloseDeleteDialog}>
						<AlertDialogOverlay />
						<AlertDialogContent>
							<AlertDialogHeader fontSize="lg" fontWeight="bold">{t("messages.organisaties.deleteTitle")}</AlertDialogHeader>
							<AlertDialogBody>{t("messages.organisaties.deleteQuestion", {name: organisatie.naam})}</AlertDialogBody>
							<AlertDialogFooter>
								<Button ref={cancelDeleteRef} onClick={onCloseDeleteDialog}>{t("global.actions.cancel")}</Button>
								<Button isLoading={deleteLoading} colorScheme="red" onClick={onConfirmDeleteDialog} ml={3}>{t("global.actions.delete")}</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					<Section>
						<OrganisatieDetailView organisatie={organisatie} />
					</Section>

					<Heading size={"md"}>{t("afdelingen")}</Heading>
					<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={5}>
						<Box>
							<Button colorScheme={"primary"} borderStyle={"dashed"} variant={"outline"} leftIcon={<AddIcon />}
								w="100%" h="100%" onClick={() => push(Routes.CreateAfdeling(organisatie.id))} borderRadius={5}
								p={5}>{t("global.actions.add")}</Button>
						</Box>
						{afdelingen.map(afdeling => (
							<AfdelingListItem key={afdeling.id} afdeling={afdeling} />
						))}
					</Grid>
				</Page>
			);
		}} />
	);
};

export default OrganisatieDetail;