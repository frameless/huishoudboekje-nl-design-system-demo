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
	Divider,
	Heading,
	HStack,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	Text,
	useDisclosure,
	UseDisclosureReturn,
} from "@chakra-ui/react";
import React, {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import SaveAfdelingPostadresErrorHandler from "../../errorHandlers/SaveAfdelingPostadresErrorHandler";
import SaveAfdelingRekeningErrorHandler from "../../errorHandlers/SaveAfdelingRekeningErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {
	Afdeling,
	GetOrganisatieDocument,
	GetOrganisatiesDocument,
	Postadres,
	Rekening,
	useCreateAfdelingPostadresMutation,
	useCreateAfdelingRekeningMutation,
	useDeleteAfdelingMutation,
} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import PostadresForm from "../Postadressen/PostadresForm";
import PostadresList from "../Postadressen/PostadresList";
import RekeningForm from "../Rekeningen/RekeningForm";
import RekeningList from "../Rekeningen/RekeningList";
import UpdateAfdelingModal from "./UpdateAfdelingModal";

const AfdelingListItemModal: React.FC<{afdeling: Afdeling, disclosure: UseDisclosureReturn}> = ({afdeling, disclosure}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const alert = useDisclosure();
	const updateModal = useDisclosure();
	const cancelRef = useRef(null);
	const navigate = useNavigate();
	const [showCreateRekeningForm, toggleCreateRekeningForm] = useState<boolean>(false);
	const [showCreatePostadresForm, toggleCreatePostadresForm] = useState<boolean>(false);
	const [createAfdelingRekening] = useCreateAfdelingRekeningMutation({
		refetchQueries: [
			{query: GetOrganisatieDocument, variables: {id: afdeling.organisatie?.id}},
		],
	});
	const [createAfdelingPostadres] = useCreateAfdelingPostadresMutation({
		refetchQueries: [
			{query: GetOrganisatieDocument, variables: {id: afdeling.organisatie?.id}},
		],
	});
	const postadressen: Postadres[] = afdeling.postadressen || [];
	const rekeningen: Rekening[] = afdeling.rekeningen || [];
	const handleSaveAfdelingRekening = useMutationErrorHandler(SaveAfdelingRekeningErrorHandler);
	const handleSaveAfdelingPostadres = useMutationErrorHandler(SaveAfdelingPostadresErrorHandler);

	const onSaveRekening = (rekening: Rekening, resetForm: VoidFunction) => {
		createAfdelingRekening({
			variables: {
				afdelingId: afdeling.id!,
				rekening,
			},
		}).then(() => {
			toast({
				success: t("messages.rekeningen.createSuccess", {...rekening}),
			});
			toggleCreateRekeningForm(false);
			resetForm();
		}).catch(handleSaveAfdelingRekening);
	};

	const onSavePostadres = (postadres, resetForm: VoidFunction) => {
		createAfdelingPostadres({
			variables: {
				afdelingId: afdeling.id!,
				...postadres,
			},
		}).then(() => {
			toast({
				success: t("messages.postadressen.createSuccess"),
			});
			toggleCreatePostadresForm(false);
			resetForm();
		}).catch(handleSaveAfdelingPostadres);
	};

	const [deleteAfdeling] = useDeleteAfdelingMutation({
		refetchQueries: [
			{query: GetOrganisatieDocument, variables: {id: afdeling.organisatie?.id}},
			{query: GetOrganisatiesDocument},
		],
	});

	const onClickDeleteAfdeling = (e) => {
		// This will prevent a click event on the parent on which e was emitted and detailsModal.onOpen will not be called.
		e.stopPropagation();
		e.preventDefault();
		alert.onOpen();
	};

	const onClickEditAfdeling = (e) => {
		// This will prevent a click event on the parent on which e was emitted and detailsModal.onOpen will not be called.
		e.stopPropagation();
		e.preventDefault();
		updateModal.onOpen();
	};

	const onConfirmDeleteAfdeling = () => {
		deleteAfdeling({
			variables: {
				afdelingId: afdeling.id!,
			},
		}).then(result => {
			toast({
				success: t("messages.afdelingen.deleteSuccess", {name: afdeling.naam}),
			});
			alert.onClose();
			disclosure.onClose();
			navigate(AppRoutes.Organisatie(afdeling.organisatie?.id));
		}).catch(err => {
			console.error(err);
			toast({
				error: err.message,
			});
		});
	};

	return (<>
		<AlertDialog isOpen={alert.isOpen} onClose={alert.onClose} leastDestructiveRef={cancelRef}>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize={"lg"} fontWeight={"bold"}>
						{t("forms.afdelingen.deleteAfdeling.title")}
					</AlertDialogHeader>
					<AlertDialogBody>
						{t("forms.afdelingen.deleteAfdeling.confirmQuestion", {
							name: afdeling.naam,
						})}
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={alert.onClose}>
							{t("global.actions.cancel")}
						</Button>
						<Button colorScheme={"red"} onClick={onConfirmDeleteAfdeling} ml={3}>
							{t("global.actions.delete")}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>

		<UpdateAfdelingModal afdeling={afdeling} disclosure={updateModal} />

		<Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
			<ModalOverlay />
			<ModalContent maxWidth={"750px"} width={"100%"}>
				<ModalHeader as={HStack}>
					<Text>{afdeling.naam}</Text>
					<Box ml={3}>
						<Menu>
							<MenuButton as={IconButton} variant={"ghost"} icon={<ChevronDownIcon />} aria-label={t("global.actions.options")} />
							<MenuList>
								<MenuItem onClick={onClickEditAfdeling}>{t("global.actions.edit")}</MenuItem>
								<MenuItem onClick={onClickDeleteAfdeling}>{t("global.actions.delete")}</MenuItem>
							</MenuList>
						</Menu>
					</Box>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack divider={<Divider />} spacing={5}>
						<Stack>
							<Heading size={"md"}>{t("postadressen")}</Heading>
							<PostadresList postadressen={postadressen} afdeling={afdeling} />
							{showCreatePostadresForm ? (<>
								{postadressen.length > 0 && <Divider />}
								<PostadresForm onSubmit={onSavePostadres} onCancel={() => toggleCreatePostadresForm(false)} />
							</>) : (
								<Box>
									<Button leftIcon={<AddIcon />} colorScheme={"primary"} size={"sm"}
										onClick={() => toggleCreatePostadresForm(true)}>{t("global.actions.add")}</Button>
								</Box>
							)}
						</Stack>

						<Stack>
							<Heading size={"md"}>{t("rekeningen")}</Heading>
							<RekeningList rekeningen={rekeningen} afdeling={afdeling} />

							{showCreateRekeningForm ? (<>
								{rekeningen.length > 0 && <Divider />}
								<RekeningForm rekening={{rekeninghouder: afdeling.naam}} onSubmit={onSaveRekening} onCancel={() => toggleCreateRekeningForm(false)} />
							</>) : (
								<Box>
									<Button leftIcon={<AddIcon />} colorScheme={"primary"} size={"sm"}
										onClick={() => toggleCreateRekeningForm(true)}>{t("global.actions.add")}</Button>
								</Box>
							)}
						</Stack>
					</Stack>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme={"primary"} mr={3} onClick={disclosure.onClose}>
						{t("global.actions.close")}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	</>);
};

export default AfdelingListItemModal;