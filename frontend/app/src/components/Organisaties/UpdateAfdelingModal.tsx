import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Afdeling, GetOrganisatieDocument, UpdateAfdelingMutationVariables, useUpdateAfdelingMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import AfdelingValidator from "../../validators/AfdelingValidator";

type UpdateAfdelingModalProps = {
	afdeling: Afdeling,
	onClose: VoidFunction
};

const UpdateAfdelingModal: React.FC<UpdateAfdelingModalProps> = ({afdeling, onClose}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const [data, setData] = useState<Partial<UpdateAfdelingMutationVariables>>({
		naam: afdeling.naam,
	});
	const [updateAfdeling] = useUpdateAfdelingMutation({
		refetchQueries: [
			{query: GetOrganisatieDocument, variables: {id: afdeling?.organisatie?.id}},
		],
	});

	const onSubmit = (e) => {
		e.preventDefault();

		updateAfdeling({
			variables: {
				id: afdeling.id!,
				...data,
			},
		}).then(() => {
			toast({
				success: t("messages.afdelingen.updateSuccess"),
			});
			onClose();
		}).catch(err => {
			toast({
				error: err.message,
			});
		});
	};

	const isValid = (fieldName: string) => AfdelingValidator.shape[fieldName].safeParse(data[fieldName]).success;

	return (
		<Modal isOpen={true} onClose={onClose}>
			<form onSubmit={onSubmit}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{t("modal.updateAfdeling.title")}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack>
							<FormControl flex={1} isInvalid={!isValid("naam")} isRequired={true}>
								<FormLabel>{t("forms.createAfdeling.naam")}</FormLabel>
								<Input value={data.naam || ""} onChange={e => setData(x => ({...x, naam: e.target.value}))} />
								<FormErrorMessage>{t("afspraakDetailView.invalidNaamError")}</FormErrorMessage>
							</FormControl>
						</Stack>
					</ModalBody>
					<ModalFooter>
						<HStack>
							<Button colorScheme={"gray"} onClick={onClose}>
								{t("global.actions.cancel")}
							</Button>
							<Button colorScheme={"primary"} type={"submit"}>
								{t("global.actions.save")}
							</Button>
						</HStack>
					</ModalFooter>
				</ModalContent>
			</form>
		</Modal>
	);
};

export default UpdateAfdelingModal;