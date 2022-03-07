import {AddIcon} from "@chakra-ui/icons";
import {Box, BoxProps, Button, Divider, Stack} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Afdeling, GetOrganisatieDocument, GetOrganisatiesDocument, useCreateAfdelingRekeningMutation} from "../../../generated/graphql";
import RekeningForm from "../../Rekeningen/RekeningForm";
import RekeningList from "../../Rekeningen/RekeningList";
import {FormLeft, FormRight} from "../../shared/Forms";

const AfdelingRekeningenView: React.FC<BoxProps & {afdeling: Afdeling}> = ({afdeling, ...props}) => {
	const {t} = useTranslation();
	const [showForm, toggleForm] = useState(false);
	const [createAfdelingRekening] = useCreateAfdelingRekeningMutation({
		refetchQueries: [
			{query: GetOrganisatiesDocument},
			{query: GetOrganisatieDocument, variables: {id: afdeling.organisatie?.id}},
		],
	});
	const onSaveRekening = (rekening, resetForm) => {
		if (!afdeling.id) {
			return null;
		}

		createAfdelingRekening({
			variables: {
				afdelingId: afdeling.id,
				rekening,
			},
		}).then(() => {
			resetForm();
			toggleForm(false);
		});
	};

	const {rekeningen = []} = afdeling;

	return (
		<Stack spacing={2} mb={1} direction={["column", "row"]}>
			<FormLeft title={t("forms.organizations.sections.rekeningen.title")} helperText={t("forms.organizations.sections.rekeningen.detailText")} />
			<FormRight justifyContent={"center"}>
				<RekeningList rekeningen={rekeningen} afdeling={afdeling} />
				{showForm ? (<>
					{rekeningen.length > 0 && <Divider />}

					<RekeningForm rekening={{
						rekeninghouder: afdeling.naam,
					}} onSubmit={onSaveRekening} onCancel={() => toggleForm(false)} />
				</>) : (
					<Box>
						<Button leftIcon={<AddIcon />} colorScheme={"primary"} size={"sm"} onClick={() => toggleForm(true)}>{t("global.actions.add")}</Button>
					</Box>
				)}
			</FormRight>
		</Stack>
	);
};

export default AfdelingRekeningenView;