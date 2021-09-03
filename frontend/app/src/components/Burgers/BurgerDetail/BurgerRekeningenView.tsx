import {AddIcon} from "@chakra-ui/icons";
import {Box, Button, Divider, Stack, StackProps} from "@chakra-ui/react";
import React from "react";
import {useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import SaveBurgerRekeningErrorHandler from "../../../errorHandlers/SaveBurgerRekeningErrorHandler";
import useMutationErrorHandler from "../../../errorHandlers/useMutationErrorHandler";
import {Burger, GetBurgerDocument, useCreateBurgerRekeningMutation} from "../../../generated/graphql";
import useToaster from "../../../utils/useToaster";
import {FormLeft, FormRight} from "../../Layouts/Forms";
import RekeningForm from "../../Rekeningen/RekeningForm";
import RekeningList from "../../Rekeningen/RekeningList";

const BurgerRekeningenView: React.FC<StackProps & {burger: Burger}> = ({burger, ...props}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const handleSaveBurgerRekening = useMutationErrorHandler(SaveBurgerRekeningErrorHandler);
	const [showCreateRekeningForm, toggleCreateRekeningForm] = useToggle(false);

	const [createBurgerRekening] = useCreateBurgerRekeningMutation({
		refetchQueries: [
			{query: GetBurgerDocument, variables: {id: burger.id}},
		],
		onCompleted: () => {
			toggleCreateRekeningForm(false);
		},
	});

	const {id: burgerId, rekeningen = []} = burger;

	const onSaveRekening = (rekening, resetForm) => {
		createBurgerRekening({
			variables: {
				burgerId: burgerId!,
				rekening,
			},
		}).then(() => {
			toast({
				success: t("messages.rekeningen.createSuccess", {...rekening})
			})
			resetForm();
		}).catch(handleSaveBurgerRekening);
	};

	return (
		<Stack spacing={2} mb={1} direction={["column", "row"]} {...props}>
			<FormLeft title={t("forms.burgers.sections.rekeningen.title")} helperText={t("forms.burgers.sections.rekeningen.detailText")} />
			<FormRight justifyContent={"center"}>
				<RekeningList rekeningen={rekeningen || []} burger={burger} />

				{burgerId && showCreateRekeningForm ? (<>
					{rekeningen.length > 0 && <Divider />}
					<RekeningForm rekening={{rekeninghouder: `${burger.voorletters} ${burger.achternaam}`}} onSave={onSaveRekening} onCancel={() => toggleCreateRekeningForm(false)} />
				</>) : (
					<Box>
						<Button leftIcon={<AddIcon />} colorScheme={"primary"} size={"sm"} onClick={() => toggleCreateRekeningForm(true)}>{t("global.actions.add")}</Button>
					</Box>
				)}
			</FormRight>
		</Stack>
	);
};

export default BurgerRekeningenView;