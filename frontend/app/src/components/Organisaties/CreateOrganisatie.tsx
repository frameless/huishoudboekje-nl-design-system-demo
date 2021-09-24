import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import SaveOrganisatieErrorHandler from "../../errorHandlers/SaveOrganisatieErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {CreateOrganisatieMutationVariables, GetOrganisatiesDocument, useCreateOrganisatieMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import BackButton from "../Layouts/BackButton";
import Page from "../Layouts/Page";
import OrganisatieForm from "./OrganisatieForm";

const CreateOrganisatie = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const toast = useToaster();
	const handleSaveOrganisatieErrors = useMutationErrorHandler(SaveOrganisatieErrorHandler);

	const [createOrganisatie, $createOrganisatie] = useCreateOrganisatieMutation({
		refetchQueries: [
			{query: GetOrganisatiesDocument},
		],
	});

	const onSubmit = (organisatieData: CreateOrganisatieMutationVariables) => {
		createOrganisatie({
			variables: organisatieData,
		}).then(result => {
			toast({
				success: t("messages.organisaties.createSuccessMessage"),
			});

			const {id} = result?.data?.createOrganisatie?.organisatie || {};
			if (id) {
				push(Routes.Organisatie(id));
			}
		}).catch(handleSaveOrganisatieErrors);
	};

	return (
		<Page title={t("forms.createOrganisatie.title")} backButton={<BackButton to={Routes.Organisaties} />}>
			<OrganisatieForm onSubmit={onSubmit} isLoading={$createOrganisatie.loading} />
		</Page>
	);
};

export default CreateOrganisatie;