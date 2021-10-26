import {AddIcon} from "@chakra-ui/icons";
import {
	Box,
	Button,
	Divider,
	Heading,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	UseDisclosureReturn,
} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import SaveAfdelingPostadresErrorHandler from "../../errorHandlers/SaveAfdelingPostadresErrorHandler";
import SaveAfdelingRekeningErrorHandler from "../../errorHandlers/SaveAfdelingRekeningErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {Afdeling, GetOrganisatieDocument, Postadres, Rekening, useCreateAfdelingPostadresMutation, useCreateAfdelingRekeningMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import PostadresForm from "../Postadressen/PostadresForm";
import PostadresList from "../Postadressen/PostadresList";
import RekeningForm from "../Rekeningen/RekeningForm";
import RekeningList from "../Rekeningen/RekeningList";

const AfdelingModal: React.FC<{afdeling: Afdeling, disclosure: UseDisclosureReturn}> = ({afdeling, disclosure}) => {
	const {t} = useTranslation();
	const toast = useToaster();
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

	return (
		<Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
			<ModalOverlay />
			<ModalContent maxWidth={"750px"} width={"100%"}>
				<ModalHeader>{afdeling.naam}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack divider={<Divider />}>
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
									<Button leftIcon={
										<AddIcon />} colorScheme={"primary"} size={"sm"} onClick={() => toggleCreateRekeningForm(true)}>{t("global.actions.add")}</Button>
								</Box>
							)}
						</Stack>
					</Stack>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme="blue" mr={3} onClick={disclosure.onClose}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AfdelingModal;