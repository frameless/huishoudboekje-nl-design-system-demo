import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {ActivityTypeFilter, UserActivitiesPagedRequest, UserActivityData, useGetBurgerUserActivitiesQueryQuery} from "../../generated/graphql";
import Queryable, {Loading} from "../../utils/Queryable";
import {formatBurgerName} from "../../utils/things";
import usePagination from "../../utils/usePagination";
import GebeurtenissenTableView from "../Gebeurtenissen/GebeurtenissenTableView";
import BackButton from "../shared/BackButton";
import Page from "../shared/Page";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import BurgerContextContainer from "./BurgerContextContainer";
import Select from "react-select";
import {Stack, FormControl, FormLabel, FormErrorMessage} from "@chakra-ui/react";

const BurgerAuditLogPage = () => {
	const {id = ""} = useParams<{id: string}>();
	const {t} = useTranslation();
	const {setTotal, pageSize, offset, PaginationButtons} = usePagination();

	const [selectedLogTypes, setSelectedLogTypes] = useState<number[]>([2])

	const options = [
		{"Name": "query", "Id": 1},
		{"Name": "mutation", "Id": 2}
	]

	const $burgerUserActivities = useGetBurgerUserActivitiesQueryQuery({
		variables: {
			ids: [parseInt(id)],
			input: getQueryVariables()
		},
		onCompleted: data => setTotal(data.UserActivities_GetUserActivitiesPaged?.PageInfo?.total_count),
	});



	function onSelectFilter(filters) {
		const ids: number[] = []
		filters.forEach(filter => {
			ids.push(filter.value)
		})
		setSelectedLogTypes(ids)
	}

	function getQueryVariables(): UserActivitiesPagedRequest {
		if (selectedLogTypes.length > 0) {
			const filters: ActivityTypeFilter[] = [];
			selectedLogTypes.forEach(type => {
				filters.push({id: type})
			})
			return {
				page: {
					skip: offset <= 1 ? 0 : offset,
					take: pageSize
				},
				Filter: {
					activityTypeFilter: filters,
					entityFilter: [{
						entityType: "burger",
						entityIds: [id]
					}]
				}
			}
		}
		return {
			page: {
				skip: offset == 1 ? 0 : offset,
				take: pageSize
			},
			Filter: {
				entityFilter: [{
					entityType: "burger",
					entityIds: [id]
				}]
			}
		}
	}

	return (
		<Queryable query={$burgerUserActivities} children={data => {
			const burger = data.burgers?.[0];
			const userActivities: UserActivityData[] = data.UserActivities_GetUserActivitiesPaged?.data || [];
			return (
				<Page title={t("pages.burgerGebeurtenissen.title", {name: formatBurgerName(burger)})} backButton={<BackButton to={AppRoutes.ViewBurger(id)} />}>
					<SectionContainer>
						<Section
							title={t("pages.gebeurtenissen.title")}
							right={<PaginationButtons />}
							left={
								<Stack w={200} direction={["column", "row"]}>
									<FormControl flex={1}>
										<FormLabel>{t("pages.gebeurtenissen.filter.title")}</FormLabel>
										<Select
											id={"postadres"}
											placeholder={t("pages.gebeurtenissen.filter.placeholder")}
											isMulti
											isClearable
											options={options.map(b => ({
												key: b.Id,
												value: b.Id,
												label: t("pages.gebeurtenissen.filter.types." + b.Name),
											}))}
											onChange={(result) => {
												onSelectFilter(result)
											}}
											defaultValue={{label: t("pages.gebeurtenissen.filter.types.mutation"), value: 2, key: 2}}

										/>
										<FormErrorMessage>{t("forms.afspraak.invalidPostadresError")}</FormErrorMessage>
									</FormControl>
								</Stack>}
						>
							{$burgerUserActivities.loading ? <Loading /> : <GebeurtenissenTableView gebeurtenissen={userActivities} />}
						</Section>
					</SectionContainer>

				</Page>
			);
		}} />
	);
};

export default BurgerAuditLogPage;
