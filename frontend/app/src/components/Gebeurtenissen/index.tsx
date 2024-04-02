import React from "react";
import {useTranslation} from "react-i18next";
import {UserActivityData, useGetUserActivitiesQuery} from "../../generated/graphql";
import Queryable, { Loading } from "../../utils/Queryable";
import usePagination from "../../utils/usePagination";
import Page from "../shared/Page";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import GebeurtenissenTableView from "./GebeurtenissenTableView";

const Gebeurtenissen = () => {
	const {t} = useTranslation();
	const {setTotal, pageSize, offset, PaginationButtons} = usePagination({
		pageSize: 25,
	});

	const $gebeurtenissen = useGetUserActivitiesQuery({
		fetchPolicy: "cache-and-network",
		variables: {
			input: {
				page: {
					skip: offset,
					take: pageSize
				}
			}
		},
		onCompleted: data => setTotal(data.UserActivities_GetUserActivitiesPaged?.PageInfo?.total_count || 0),
	});

	return (
		<Page title={t("pages.gebeurtenissen.title")}>
			<Queryable query={$gebeurtenissen} children={data => {
				const gs: UserActivityData[] = data.UserActivities_GetUserActivitiesPaged?.data || [];
				return (
					<SectionContainer>
						<Section title={t("pages.gebeurtenissen.title")} helperText={t("pages.gebeurtenissen.helperText")} right={<PaginationButtons />}>
							{$gebeurtenissen.loading ? <Loading/> : <GebeurtenissenTableView gebeurtenissen={gs} />}
						</Section>
					</SectionContainer>
				);
			}} />
		</Page>
	);
};

export default Gebeurtenissen;