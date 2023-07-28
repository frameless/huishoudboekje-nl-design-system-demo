import {useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import SaveOrganisatieErrorHandler from "../../errorHandlers/SaveOrganisatieErrorHandler";
import useMutationErrorHandler from "../../errorHandlers/useMutationErrorHandler";
import {GetOrganisatieDocument, GetOrganisatiesDocument, Organisatie, UpdateOrganisatieMutationVariables, useGetOrganisatieQuery, useUpdateOrganisatieMutation} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {maxOrganisatieNaamLengthBreakpointValues, truncateText} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import BackButton from "../shared/BackButton";
import Page from "../shared/Page";
import OrganisatieForm from "./OrganisatieForm";

const EditOrganisatie = () => {
	const {t} = useTranslation();
	const {id = ""} = useParams<{id: string}>();
	const toast = useToaster();
	const navigate = useNavigate();
	const handleSaveOrganisatieErrors = useMutationErrorHandler(SaveOrganisatieErrorHandler);
	const maxOrganisatieNaamLength = useBreakpointValue(maxOrganisatieNaamLengthBreakpointValues);

	const $organisatie = useGetOrganisatieQuery({
		variables: {id: parseInt(id)},
	});
	const [updateOrganisatie, $updateOrganisatie] = useUpdateOrganisatieMutation({
		refetchQueries: [
			{query: GetOrganisatiesDocument},
			{query: GetOrganisatieDocument, variables: {id: parseInt(id)}},
		],
	});

	const onSubmit = (data: Omit<UpdateOrganisatieMutationVariables, "id">) => {
		updateOrganisatie({
			variables: {
				...data,
				id: parseInt(id),
			},
		}).then(() => {
			toast({
				success: t("messages.organisaties.updateSuccessMessage"),
			});
			navigate(AppRoutes.Organisatie(id), {replace: true});
		}).catch(handleSaveOrganisatieErrors);
	};

	return (
		<Queryable query={$organisatie} error={<Navigate to={AppRoutes.NotFound} replace />}>{({organisatie}: {organisatie: Organisatie}) => (
			<Page backButton={<BackButton to={AppRoutes.Organisatie(id)} />} title={truncateText(organisatie.naam || "", maxOrganisatieNaamLength)}>
				<OrganisatieForm onSubmit={onSubmit} isLoading={$updateOrganisatie.loading} organisatie={organisatie} />
			</Page>
		)}
		</Queryable>
	);
};

export default EditOrganisatie;
