import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel, HStack,
	Input,
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
import {Afdeling, GetOrganisatieDocument, UpdateAfdelingMutationVariables, useUpdateAfdelingMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import AfdelingValidator from "../../validators/AfdelingValidator";

const UpdateAfdelingModal: React.FC<{afdeling: Afdeling, disclosure: UseDisclosureReturn}> = ({afdeling, disclosure}) => {
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
			disclosure.onClose();
		}).catch(err => {
			toast({
				error: err.message,
			});
		});
	};

	const isValid = (fieldName: string) => AfdelingValidator.shape[fieldName].safeParse(data[fieldName]).success;

	return (
		<Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
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
							<Button colorScheme={"gray"} onClick={disclosure.onClose}>
								{t("global.actions.cancel")}
							</Button>
							<Button colorScheme={"primary"} type="submit">
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