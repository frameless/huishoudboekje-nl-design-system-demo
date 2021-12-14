import {AddIcon} from "@chakra-ui/icons";
import {Box, Button, Stack, StackProps, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import SaveBurgerRekeningErrorHandler from "../../../errorHandlers/SaveBurgerRekeningErrorHandler";
import useMutationErrorHandler from "../../../errorHandlers/useMutationErrorHandler";
import {Burger, GetBurgerDocument, useCreateBurgerRekeningMutation} from "../../../generated/graphql";
import useToaster from "../../../utils/useToaster";
import {FormLeft, FormRight} from "../../Layouts/Forms";
import AddRekeningModal from "../../Rekeningen/AddRekeningModal";
import RekeningList from "../../Rekeningen/RekeningList";

const BurgerRekeningenView: React.FC<StackProps & {burger: Burger}> = ({burger, ...props}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const addRekeningModal = useDisclosure();
	const handleSaveBurgerRekening = useMutationErrorHandler(SaveBurgerRekeningErrorHandler);

	const [createBurgerRekening] = useCreateBurgerRekeningMutation({
		refetchQueries: [
			{query: GetBurgerDocument, variables: {id: burger.id}},
		],
	});

	const {id: burgerId, rekeningen = []} = burger;

	const onSaveRekening = (rekening) => {
		createBurgerRekening({
			variables: {
				burgerId: burgerId!,
				rekening,
			},
		}).then(() => {
			toast({
				success: t("messages.rekeningen.createSuccess", {...rekening}),
			});
			addRekeningModal.onClose();
		}).catch(handleSaveBurgerRekening);
	};

	return (<>
		{addRekeningModal.isOpen && (
			<AddRekeningModal onSubmit={onSaveRekening} onClose={addRekeningModal.onClose} name={`${burger.voorletters} ${burger.achternaam}`} />
		)}

		<Stack spacing={2} mb={1} direction={["column", "row"]} {...props}>
			<FormLeft title={t("forms.burgers.sections.rekeningen.title")} helperText={t("forms.burgers.sections.rekeningen.detailText")} />
			<FormRight justifyContent={"center"}>
				<RekeningList rekeningen={rekeningen || []} burger={burger} />
				<Box>
					<Button leftIcon={<AddIcon />} colorScheme={"primary"} size={"sm"} onClick={() => addRekeningModal.onOpen()}>{t("global.actions.add")}</Button>
				</Box>
			</FormRight>
		</Stack>
	</>);
};

export default BurgerRekeningenView;