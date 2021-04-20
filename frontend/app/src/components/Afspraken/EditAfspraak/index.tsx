import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory, useParams} from "react-router-dom";
import Routes from "../../../config/routes";
import {Afspraak, UpdateAfspraakMutationVariables, useGetAfspraakFormDataQuery, useUpdateAfspraakMutation} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useHandleMutation from "../../../utils/useHandleMutation";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";
import BackButton from "../../Layouts/BackButton";
import Page from "../../Layouts/Page";
import Section from "../../Layouts/Section";
import PageNotFound from "../../PageNotFound";
import AfspraakForm from "../AfspraakForm";
import AfspraakFormContext, {AfspraakFormContextType} from "./context";

const EditAfspraak = () => {
	const {id} = useParams<{id: string}>();
	const {t} = useTranslation();
	const handleMutation = useHandleMutation();
	const [updateAfspraakMutation] = useUpdateAfspraakMutation();
	const {push} = useHistory();

	const $afspraak = useGetAfspraakFormDataQuery({
		variables: {
			afspraakId: parseInt(id),
		},
	});

	return (
		<Queryable query={$afspraak} children={(data) => {
			const afspraak: Afspraak = data.afspraak;

			if (!afspraak) {
				return <PageNotFound />;
			}

			const editAfspraakValues: UpdateAfspraakMutationVariables["input"] = {
				bedrag: parseFloat(afspraak.bedrag),
				credit: afspraak.credit,
				rubriekId: afspraak.rubriek?.id,
				omschrijving: afspraak.omschrijving,
				tegenRekeningId: afspraak.tegenRekening?.id,
			};

			const updateAfspraak = (data: UpdateAfspraakMutationVariables["input"]) => handleMutation(updateAfspraakMutation({
				variables: {
					id: afspraak.id!,
					input: data,
				},
			}), t("messages.updateAfspraakSuccess"), () => push(Routes.ViewAfspraak(afspraak.id)));

			const ctxValue: AfspraakFormContextType = {
				rubrieken: data.rubrieken || [],
				organisaties: data.organisaties || [],
			};

			return (
				<Page title={t("forms.agreements.titleEdit")} backButton={<BackButton to={Routes.ViewAfspraak(afspraak.id)} />}>
					<Section direction={["column", "row"]}>
						<FormLeft title={t("afspraakForm.section1.title")} helperText={t("afspraakForm.section1.helperText")} />
						<FormRight spacing={5}>
							<AfspraakFormContext.Provider value={ctxValue}>
								<AfspraakForm burgerRekeningen={afspraak.burger?.rekeningen || []} values={editAfspraakValues} onChange={updateAfspraak} />
							</AfspraakFormContext.Provider>
						</FormRight>
					</Section>
				</Page>
			);
		}} />
	);
};

export default EditAfspraak;