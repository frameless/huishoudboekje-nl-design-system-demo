import {AddIcon} from "@chakra-ui/icons";
import {Box, BoxProps, Button, Divider, Stack} from "@chakra-ui/react";
import React from "react";
import {useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {GetOrganisatieDocument, GetOrganisatiesDocument, Organisatie, useCreateOrganisatieRekeningMutation} from "../../../generated/graphql";
import {FormLeft, FormRight} from "../../Layouts/Forms";
import Section from "../../Layouts/Section";
import RekeningForm from "../../Rekeningen/RekeningForm";
import RekeningList from "../../Rekeningen/RekeningList";

const OrganisatieRekeningenView: React.FC<BoxProps & {organisatie: Organisatie}> = ({organisatie, ...props}) => {
	const {t} = useTranslation();
	const [showForm, toggleForm] = useToggle(false);
	const [createRekeningForOrg] = useCreateOrganisatieRekeningMutation({
		refetchQueries: [
			{query: GetOrganisatiesDocument},
			{query: GetOrganisatieDocument, variables: {id: organisatie.id}},
		],
	});
	const onSaveRekening = (rekening, resetForm) => {
		if (!organisatie.id) {
			return null;
		}

		createRekeningForOrg({
			variables: {
				orgId: organisatie.id,
				rekening,
			},
		}).then(() => {
			resetForm();
			toggleForm(false);
		});
	};

	const {rekeningen = []} = organisatie;

	return (
		<Section {...props}>
			<Stack spacing={2} mb={1} direction={["column", "row"]}>
				<FormLeft title={t("forms.organizations.sections.rekeningen.title")} helperText={t("forms.organizations.sections.rekeningen.detailText")} />
				<FormRight justifyContent={"center"}>
					<RekeningList rekeningen={rekeningen} organisatie={organisatie} />
					{showForm ? (<>
						{rekeningen.length > 0 && <Divider />}

						<RekeningForm rekening={{
							rekeninghouder: organisatie.kvkDetails?.naam,
						}} onSave={onSaveRekening} onCancel={() => toggleForm(false)} />
					</>) : (
						<Box>
							<Button leftIcon={<AddIcon />} colorScheme={"primary"} size={"sm"} onClick={() => toggleForm(true)}>{t("actions.add")}</Button>
						</Box>
					)}
				</FormRight>
			</Stack>
		</Section>
	);
};

export default OrganisatieRekeningenView;