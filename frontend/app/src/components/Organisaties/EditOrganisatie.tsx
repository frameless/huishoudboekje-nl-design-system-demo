import React from "react";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import SaveOrganisatieErrorHandler from "../../errorHandlers/SaveOrganisatieErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {
	GetOrganisatieDocument,
	GetOrganisatiesDocument,
	Organisatie,
	UpdateOrganisatieMutationVariables,
	useGetOrganisatieQuery,
	useUpdateOrganisatieMutation,
} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import useToaster from "../../utils/useToaster";
import BackButton from "../Layouts/BackButton";
import Page from "../Layouts/Page";
import OrganisatieForm from "./OrganisatieForm";

const EditOrganisatie = () => {
	const {t} = useTranslation();
	const {id} = useParams<{id: string}>();
	const toast = useToaster();
	const {push} = useHistory();
	const handleSaveOrganisatieErrors = useMutationErrorHandler(SaveOrganisatieErrorHandler);

	const $organisatie = useGetOrganisatieQuery({
		variables: {id: parseInt(id)},
	});
	const [updateOrganisatie, $updateOrganisatie] = useUpdateOrganisatieMutation({
		refetchQueries: [
			{query: GetOrganisatiesDocument},
			{query: GetOrganisatieDocument, variables: {id: parseInt(id)}},
		],
	});

	const onSubmit = (data: UpdateOrganisatieMutationVariables) => {
		updateOrganisatie({
			variables: data,
		}).then(() => {
			toast({
				success: t("messages.organisaties.updateSuccessMessage"),
			});
			push(Routes.Organisatie(parseInt(id)));
		}).catch(handleSaveOrganisatieErrors);
	};

	return (
		<Queryable query={$organisatie} error={<Redirect to={Routes.NotFound} />}>{({organisatie}: {organisatie: Organisatie}) => (
			<Page backButton={<BackButton to={Routes.Organisatie(parseInt(id))} />} title={organisatie.kvkDetails?.naam || ""}>
				<OrganisatieForm onSubmit={onSubmit} isLoading={$updateOrganisatie.loading} organisatie={organisatie} />
			</Page>
		)}
		</Queryable>
	);
};

export default EditOrganisatie;