import {List, ListIcon, ListItem} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {MdCheckCircle, MdReportProblem} from "react-icons/md";
import {useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Afspraak, CreateAfspraakMutationVariables, useAddAfspraakZoektermMutation, useCreateAfspraakMutation, useGetAfspraakFormDataQuery} from "../../../generated/graphql";
import d from "../../../utils/dayjs";
import Queryable from "../../../utils/Queryable";
import useToaster from "../../../utils/useToaster";
import BackButton from "../../Layouts/BackButton";
import Page from "../../Layouts/Page";
import Section from "../../Layouts/Section";
import PageNotFound from "../../PageNotFound";
import AfspraakForm from "../AfspraakForm";
import AfspraakFormContext from "../EditAfspraak/context";
import ZoektermenList from "../ZoektermenList";
import {FollowUpAfspraakFormContextType} from "./context";

const FollowUpAfspraak = () => {
	const {id = ""} = useParams<{id: string}>();
	const {t} = useTranslation();
	const toast = useToaster();
	const [createAfspraak] = useCreateAfspraakMutation();
	const [addAfspraakZoekterm] = useAddAfspraakZoektermMutation();
	const navigate = useNavigate();

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
					const addZoektermen = (afspraak.zoektermen || []).map(async z => addAfspraakZoekterm({variables: {afspraakId: createdAfspraakId, zoekterm: z}}));

					// This is why we use BatchHttpLink in src/services/graphql-client.ts, so that all of these will be sent in one HTTP request.
					Promise.all(addZoektermen)
						   .then(() => {
							   toast({
								   success: t("messages.createAfspraakSuccess"),
							   });
							   navigate(AppRoutes.ViewAfspraak(createdAfspraakId));
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
				afdelingId: afspraak.afdeling?.id,
				tegenRekeningId: afspraak.tegenRekening?.id,
				postadresId: afspraak.postadres?.id,
			};

			const ctxValue: FollowUpAfspraakFormContextType = {
				rubrieken: data.rubrieken || [],
				organisaties: data.organisaties || [],
			};

			return (
				<Page title={t("afspraken.vervolgAfspraak.title")} backButton={<BackButton to={AppRoutes.ViewAfspraak(afspraak.id)} />}>
					{((afspraak.zoektermen && afspraak.zoektermen.length > 0) || afspraak.betaalinstructie) && (
						<Section>
							<List spacing={2}>
								{afspraak.zoektermen && afspraak.zoektermen.length > 0 && (
									<ListItem justify={"center"}>
										<ListIcon as={MdCheckCircle} color="green.500" w={5} h={5} verticalAlign={"middle"} />
										{t("afspraken.vervolgAfspraak.zoektermenHelperText")}
										<ZoektermenList zoektermen={afspraak.zoektermen || []} />
									</ListItem>
								)}
								{afspraak.betaalinstructie && (
									<ListItem justify={"center"}>
										<ListIcon as={MdReportProblem} color="orange.500" w={5} h={5} verticalAlign={"middle"} />
										{t("afspraken.vervolgAfspraak.betaalinstructieHelperText")}
									</ListItem>
								)}
							</List>
						</Section>
					)}

					<AfspraakFormContext.Provider value={ctxValue}>
						<AfspraakForm burgerRekeningen={afspraak.burger?.rekeningen || []} values={values} onChange={createFollowupAfspraak} />
					</AfspraakFormContext.Provider>
				</Page>
			);
		}} />
	);
};

export default FollowUpAfspraak;