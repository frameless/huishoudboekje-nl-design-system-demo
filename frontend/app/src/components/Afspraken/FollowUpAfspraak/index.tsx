import {List, ListIcon, ListItem} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {MdCheckCircle, MdReportProblem} from "react-icons/md";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Afspraak, CreateAfspraakMutationVariables, GetBurgerAfsprakenDocument, GetBurgerDetailsDocument, useAddAfspraakZoektermMutation, useCreateAfspraakMutation, useGetAfspraakFormDataQuery} from "../../../generated/graphql";
import d from "../../../utils/dayjs";
import Queryable from "../../../utils/Queryable";
import useToaster from "../../../utils/useToaster";
import BackButton from "../../shared/BackButton";
import Page from "../../shared/Page";
import PageNotFound from "../../shared/PageNotFound";
import SectionContainer from "../../shared/SectionContainer";
import ZoektermenList from "../../shared/ZoektermenList";
import AfspraakForm from "../AfspraakForm";
import AfspraakFormContext from "../EditAfspraak/context";
import {FollowUpAfspraakFormContextType} from "./context";

const FollowUpAfspraak = () => {
	const {id = ""} = useParams<{id: string}>();
	const location = useLocation();

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

	const isCopy = location.pathname.endsWith("/kopie")

	return (
		<Queryable query={$afspraak} children={(data) => {
			const afspraak: Afspraak = data.afspraak;

			if (!afspraak.burger?.id) {
				return <PageNotFound />;
			}


			// TODO: Make this one call when refactoring the new HHBService
			const createFollowupAfspraak = async (input: Omit<CreateAfspraakMutationVariables["input"], "burgerId">) => {
				if (!afspraak.burger?.id) {
					return;
				}

				// Create afspraak first
				const data = await createAfspraak({
					variables: {
						input: {
							burgerId: afspraak.burger.id,
							...input,
						},
					},
					refetchQueries: [{query: GetBurgerDetailsDocument, variables: {id: afspraak.burger?.id}}]
				});

				// Once the afspraak is created, use the id and add every zoekterm
				const createdAfspraakId = data.data?.createAfspraak?.afspraak?.id;

				if (createdAfspraakId) {
					const addZoektermen = (afspraak.zoektermen || []).map(async z => addAfspraakZoekterm({variables: {afspraakId: createdAfspraakId, zoekterm: z}}));

					// This is why we use BatchHttpLink in src/services/graphql-client.ts, so that all of these will be sent in one HTTP request.
					// Reply - Batching should be used to reduce page loading times by gathering all the data as a single request instead of multiple, 
					// 			not as a method to skip creating an endpoint that accepts a list of zoektermen and inserts them, which would be infinitely faster....
					Promise.all(addZoektermen)
						.then(() => {
							toast({
								success: t("messages.createAfspraakSuccess"),
							});
							navigate(AppRoutes.ViewAfspraak(String(createdAfspraakId)), {replace: true});
						})
						.catch(err => {
							toast({
								error: err.message,
							});
						});
				}
			};

			const validFromDay = isCopy ? d() : d(afspraak.validThrough, "YYYY-MM-DD").add(1, "day")

			const values: Partial<CreateAfspraakMutationVariables["input"]> = {
				bedrag: parseFloat(afspraak.bedrag),
				credit: afspraak.credit,
				rubriekId: afspraak.rubriek?.id,
				omschrijving: isCopy ? "KOPIE - " + afspraak.omschrijving : afspraak.omschrijving,
				afdelingId: afspraak.afdeling?.id,
				tegenRekeningId: afspraak.tegenRekening?.id,
				postadresId: afspraak.postadres?.id,
				validFrom: validFromDay.format("YYYY-MM-DD")
			};

			const ctxValue: FollowUpAfspraakFormContextType = {
				rubrieken: data.rubrieken || [],
				organisaties: data.organisaties || [],
			};

			return (
				<Page title={isCopy ? t("afspraken.copy.title") : t("afspraken.vervolgAfspraak.title")} backButton={<BackButton to={AppRoutes.ViewAfspraak(String(afspraak.id))} />}>
					{((afspraak.zoektermen || []).length > 0 || afspraak.betaalinstructie) && (
						<SectionContainer>
							<List spacing={2}>
								{afspraak.zoektermen && afspraak.zoektermen.length > 0 && (
									<ListItem justifyContent={"center"}>
										<ListIcon as={MdCheckCircle} color={"green.500"} w={5} h={5} verticalAlign={"middle"} />
										{t("afspraken.vervolgAfspraak.zoektermenHelperText")}
										<ZoektermenList zoektermen={afspraak.zoektermen || []} />
									</ListItem>
								)}
								{afspraak.betaalinstructie && (
									<ListItem justifyContent={"center"}>
										<ListIcon as={MdReportProblem} color={"orange.500"} w={5} h={5} verticalAlign={"middle"} />
										{t("afspraken.vervolgAfspraak.betaalinstructieHelperText")}
									</ListItem>
								)}
							</List>
						</SectionContainer>
					)}

					<AfspraakFormContext.Provider value={ctxValue}>
						<AfspraakForm burgerRekeningen={afspraak.burger?.rekeningen || []} organisatie={afspraak.afdeling?.organisatie} values={values} onSubmit={createFollowupAfspraak} />
					</AfspraakFormContext.Provider>
				</Page>
			);
		}} />
	);
};

export default FollowUpAfspraak;
