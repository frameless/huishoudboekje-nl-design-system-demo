import React, {useState} from "react";
import Select from "react-select";
import {useTranslation} from "react-i18next";
import {ActivityTypeFilter, UserActivitiesPagedRequest, UserActivityData, useGetUserActivitiesQuery} from "../../generated/graphql";
import Queryable, {Loading} from "../../utils/Queryable";
import usePagination from "../../utils/usePagination";
import Page from "../shared/Page";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import GebeurtenissenTableView from "./GebeurtenissenTableView";
import {FormControl, FormErrorMessage, FormLabel, Stack} from "@chakra-ui/react";
import useGebeurtenissenPageStore from "./gebeurtenissenStore";

const Gebeurtenissen = () => {
	const {t} = useTranslation();


	const {setTotal, goFirst, pageSize, offset, PaginationButtons} = usePagination({
			pageSize: 25, 
			startPage: useGebeurtenissenPageStore((state) => state.page)
		},
		undefined,
		useGebeurtenissenPageStore((state) => state.updatePage)
	);

	const selectedLogTypes = useGebeurtenissenPageStore((state) => state.selectedLogTypes)
	const setSelectedLogTypes = useGebeurtenissenPageStore((state) => state.setSelectedLogTypes)


	const options = [
		{"Name": "query", "Id": 1},
		{"Name": "mutation", "Id": 2}
	]

	const $gebeurtenissen = useGetUserActivitiesQuery({
		fetchPolicy: "cache-and-network",

		variables: {
			input: getQueryVariables()
		},
		onCompleted: data => setTotal(data.UserActivities_GetUserActivitiesPaged?.PageInfo?.total_count || 0),
	});

	function onSelectFilter(filters) {
		const ids: number[] = []
		filters.forEach(filter => {
			ids.push(filter.value)
		})
		setSelectedLogTypes(ids)
		goFirst()
	}

	function getQueryVariables(): UserActivitiesPagedRequest {
		if (selectedLogTypes.length > 0) {
			const filters: ActivityTypeFilter[] = [];
			selectedLogTypes.forEach(type => {
				filters.push({id: type})
			})
			return {
				page: {
					skip: offset == 1 ? 0 : offset,
					take: pageSize
				},
				Filter: {
					activityTypeFilter: filters
				}
			}
		}
		return {
			page: {
				skip: offset == 1 ? 0 : offset,
				take: pageSize
			}
		}
	}

	return (
		<Page title={t("pages.gebeurtenissen.title")}>
			<Queryable query={$gebeurtenissen} children={data => {
				const gs: UserActivityData[] = data.UserActivities_GetUserActivitiesPaged?.data || [];
				return (
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
											defaultValue={selectedLogTypes ? 
												options.map(b => ({
													key: b.Id,
													value: b.Id,
													label: t("pages.gebeurtenissen.filter.types." + b.Name),
												})).filter(option => selectedLogTypes.includes(option.value))
												: {label: t("pages.gebeurtenissen.filter.types.mutation"), value: 2, key: 2}}

										/>
										<FormErrorMessage>{t("forms.afspraak.invalidPostadresError")}</FormErrorMessage>
									</FormControl>
								</Stack>}
						>
							{$gebeurtenissen.loading ? <Loading /> : <GebeurtenissenTableView gebeurtenissen={gs} />}
						</Section>
					</SectionContainer>
				);
			}} />
		</Page>
	);
};

export default Gebeurtenissen;