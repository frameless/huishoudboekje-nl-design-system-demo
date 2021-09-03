import {AddIcon} from "@chakra-ui/icons";
import {Box, Button, Divider, Stack, StackProps} from "@chakra-ui/react";
import React from "react";
import {useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Burger, GetBurgerDocument, useCreateBurgerRekeningMutation} from "../../../generated/graphql";
import useToaster from "../../../utils/useToaster";
import {FormLeft, FormRight} from "../../Layouts/Forms";
import RekeningForm from "../../Rekeningen/RekeningForm";
import RekeningList from "../../Rekeningen/RekeningList";

const BurgerRekeningenView: React.FC<StackProps & {burger: Burger}> = ({burger, ...props}) => {
	const {t} = useTranslation();
	const toast = useToaster();
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

	return (
		<Stack spacing={2} mb={1} direction={["column", "row"]} {...props}>
			<FormLeft title={t("forms.burgers.sections.rekeningen.title")} helperText={t("forms.burgers.sections.rekeningen.detailText")} />
			<FormRight justifyContent={"center"}>
				<RekeningList rekeningen={rekeningen || []} burger={burger} />

				{burgerId && showCreateRekeningForm ? (<>
					{rekeningen.length > 0 && <Divider />}
					<RekeningForm rekening={{
						rekeninghouder: `${burger.voorletters} ${burger.achternaam}`,
					}} onSave={(rekening, resetForm) => {
						createBurgerRekening({
							variables: {
								burgerId,
								rekening,
							},
						}).then(() => {
							resetForm();
						}).catch(err => {
							let errorMessage = err.message;

							if (err.message.includes("already exists")) {
								errorMessage = t("messages.rekeningAlreadyExistsError");
							}
							toast({
								error: errorMessage,
							});
						});
					}} onCancel={() => {
						toggleCreateRekeningForm(false);
					}} />
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