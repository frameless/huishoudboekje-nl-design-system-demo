import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import SaveAfdelingErrorHandler from "../../errorHandlers/SaveAfdelingErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {
	CreateAfdelingMutationVariables,
	GetOrganisatieDocument,
	GetOrganisatiesDocument,
	Organisatie,
	useCreateAfdelingMutation,
	useGetOrganisatieQuery,
} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import useToaster from "../../utils/useToaster";
import BackButton from "../Layouts/BackButton";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";
import AfdelingForm from "./AfdelingForm";

const CreateAfdeling = () => {
	const {organisatieId} = useParams<{organisatieId: string}>();
	const {t} = useTranslation();
	const {push} = useHistory();
	const toast = useToaster();
	const handleSaveAfdelingErrors = useMutationErrorHandler(SaveAfdelingErrorHandler);

	const [createAfdeling] = useCreateAfdelingMutation({
		refetchQueries: [
			{query: GetOrganisatiesDocument},
			{query: GetOrganisatieDocument, variables: {id: organisatieId}},
		],
	});

	const onSubmit = (afdelingData: CreateAfdelingMutationVariables) => {
		createAfdeling({
			variables: afdelingData,
		}).then(result => {
			toast({
				success: t("messages.afdelingen.createSuccessMessage"),
			});

			push(Routes.Organisatie(parseInt(organisatieId)));
		}).catch(handleSaveAfdelingErrors);
	};

	const $organisatie = useGetOrganisatieQuery({
		variables: {
			id: parseInt(organisatieId),
		},
	});

	return (
		<Page title={t("forms.createAfdeling.title")} backButton={<BackButton to={Routes.Organisatie(parseInt(organisatieId))} />}>
			<Queryable query={$organisatie} children={data => {
				const organisatie: Organisatie = data.organisatie || {};

				return (
					<Section>
						<AfdelingForm onChange={onSubmit} organisatie={organisatie} />
					</Section>
				);
			}} />
		</Page>
	);
};

export default CreateAfdeling;