import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import SaveOrganisatieErrorHandler from "../../errorHandlers/SaveOrganisatieErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {CreateOrganisatieMutationVariables, GetOrganisatiesDocument, useCreateOrganisatieMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import Page from "../shared/Page";
import BackButton from "../shared/BackButton";
import OrganisatieForm from "./OrganisatieForm";

const CreateOrganisatie = () => {
	const {t} = useTranslation();
	const navigate = useNavigate();
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
				navigate(AppRoutes.Organisatie(String(id)));
			}
		}).catch(handleSaveOrganisatieErrors);
	};

	return (
		<Page title={t("forms.createOrganisatie.title")} backButton={<BackButton to={AppRoutes.Organisaties} />}>
			<OrganisatieForm onSubmit={onSubmit} isLoading={$createOrganisatie.loading} />
		</Page>
	);
};

export default CreateOrganisatie;