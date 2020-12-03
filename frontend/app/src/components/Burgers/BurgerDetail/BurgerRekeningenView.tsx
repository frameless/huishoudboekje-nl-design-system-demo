import {AddIcon} from "@chakra-ui/icons";
import {Box, Button, Divider, Stack, StackProps} from "@chakra-ui/react";
import React from "react";
import {useIsMobile, useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Gebruiker, useCreateGebruikerRekeningMutation} from "../../../generated/graphql";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";
import RekeningForm from "../../Rekeningen/RekeningForm";
import RekeningList from "../../Rekeningen/RekeningList";

const BurgerRekeningenView: React.FC<StackProps & { burger: Gebruiker, refetch: VoidFunction }> = ({burger, refetch, ...props}) => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();

	const [showCreateRekeningForm, toggleCreateRekeningForm] = useToggle(false);
	const [createGebruikerRekeningMutation] = useCreateGebruikerRekeningMutation();

	const {id: burgerId, rekeningen = []} = burger;

	return (
		<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"} {...props}>
			<FormLeft title={t("forms.burgers.sections.rekeningen.title")} helperText={t("forms.burgers.sections.rekeningen.detailText")} />
			<FormRight justifyContent={"center"}>
				<RekeningList rekeningen={rekeningen || []} gebruiker={burger} onChange={() => refetch()} />

				{burgerId && showCreateRekeningForm ? (<>
					{rekeningen.length > 0 && <Divider />}
					<RekeningForm rekening={{
						rekeninghouder: `${burger.voorletters} ${burger.achternaam}`
					}} onSave={(rekening, resetForm) => {
						createGebruikerRekeningMutation({
							variables: {
								gebruikerId: burgerId,
								rekening
							}
						}).then(() => {
							resetForm();
							toggleCreateRekeningForm(false);
							refetch();
						});
					}} onCancel={() => {
						toggleCreateRekeningForm(false)
					}} />
				</>) : (
					<Box>
						<Button leftIcon={<AddIcon />} colorScheme={"primary"} size={"sm"}
						        onClick={() => toggleCreateRekeningForm(true)}>{t("actions.add")}</Button>
					</Box>
				)}
			</FormRight>
		</Stack>
	);
};

export default BurgerRekeningenView;