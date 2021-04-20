import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory, useParams} from "react-router-dom";
import Routes from "../../../config/routes";
import {Afspraak, CreateAfspraakMutationVariables, useAddAfspraakZoektermMutation, useCreateAfspraakMutation, useGetAfspraakFormDataQuery} from "../../../generated/graphql";
import d from "../../../utils/dayjs";
import Queryable from "../../../utils/Queryable";
import useToaster from "../../../utils/useToaster";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";
import BackButton from "../../Layouts/BackButton";
import Page from "../../Layouts/Page";
import Section from "../../Layouts/Section";
import PageNotFound from "../../PageNotFound";
import AfspraakForm from "../AfspraakForm";
import AfspraakFormContext from "../EditAfspraak/context";
import {FollowUpAfspraakFormContextType} from "./context";

// Todo: zoektermen ook aanmaken bij nieuwe afspraak werkt niet, want twee mutations tegelijk slaat enkel de laatste zoekterm op!

const FollowUpAfspraak = () => {
	const {id} = useParams<{id: string}>();
	const {t} = useTranslation();
	const toast = useToaster();
	const [createAfspraak] = useCreateAfspraakMutation();
	const [addAfspraakZoekterm] = useAddAfspraakZoektermMutation();
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

			const createFollowupAfspraak = async (input: Omit<CreateAfspraakMutationVariables["input"], "burgerId">) => {
				// Create afspraak first
				const data = await createAfspraak({
					variables: {
						input: {
							burgerId: afspraak.burger?.id!,
							validFrom: d(afspraak.validThrough, "YYYY-MM-DD").add(1, "day").format("YYYY-MM-DD"),
							...input,
						},
					},
				});

				// Once the afspraak is created, use the id and add every zoekterm
				const createdAfspraakId = data.data?.createAfspraak?.afspraak?.id;

				if (createdAfspraakId) {
					const addZoektermen = (afspraak.zoektermen || []).map(async z => {
						return await addAfspraakZoekterm({variables: {afspraakId: createdAfspraakId, zoekterm: z}});
					});

					Promise.all(addZoektermen)
						.then((result) => {
							toast({
								success: t("messages.createAfspraakSuccess"),
							});
							push(Routes.ViewAfspraak(createdAfspraakId));
						})
						.catch(err => {
							toast({
								error: err.message,
							});
						});
				}
			};

			const values: Partial<CreateAfspraakMutationVariables["input"]> = {
				bedrag: parseFloat(afspraak.bedrag),
				credit: afspraak.credit,
				rubriekId: afspraak.rubriek?.id,
				omschrijving: afspraak.omschrijving,
				organisatieId: afspraak.organisatie?.id,
				tegenRekeningId: afspraak.tegenRekening?.id,
			};

			const ctxValue: FollowUpAfspraakFormContextType = {
				rubrieken: data.rubrieken || [],
				organisaties: data.organisaties || [],
			};

			return (
				<Page title={t("afspraken.vervolg.pageTitle")} backButton={<BackButton to={Routes.ViewAfspraak(afspraak.id)} />}>
					<Section direction={["column", "row"]}>
						<FormLeft title={t("afspraakForm.section1.title")} helperText={t("afspraakForm.section1.helperText")} />
						<FormRight spacing={5}>
							<AfspraakFormContext.Provider value={ctxValue}>
								<AfspraakForm burgerRekeningen={afspraak.burger?.rekeningen || []} values={values} onChange={createFollowupAfspraak} />
							</AfspraakFormContext.Provider>
						</FormRight>
					</Section>
				</Page>
			);
		}} />
	);
};

export default FollowUpAfspraak;