import React from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {UserActivityData, useGetBurgerUserActivitiesQueryQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {formatBurgerName} from "../../utils/things";
import usePagination from "../../utils/usePagination";
import GebeurtenissenTableView from "../Gebeurtenissen/GebeurtenissenTableView";
import BackButton from "../shared/BackButton";
import Page from "../shared/Page";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import BurgerContextContainer from "./BurgerContextContainer";

const BurgerAuditLogPage = () => {
	const {id = ""} = useParams<{id: string}>();
	const {t} = useTranslation();
	const {setTotal, pageSize, offset, PaginationButtons} = usePagination();
	const $burgerUserActivities = useGetBurgerUserActivitiesQueryQuery({
		variables: {
			ids: [parseInt(id)],
			input: {
				page: {
					skip: offset <= 1 ? 0 : offset,
					take: pageSize
				}, Filter: {
					entityFilter: [{
						entityType: "burger",
						entityIds: [id]
					}]
				}
			}
		},
		onCompleted: data => setTotal(data.UserActivities_GetUserActivitiesPaged?.PageInfo?.total_count),
	});

	return (
		<Queryable query={$burgerUserActivities} children={data => {
			const burger = data.burgers?.[0];
			const userActivities: UserActivityData[] = data.UserActivities_GetUserActivitiesPaged?.data || [];
			return (
				<Page title={t("pages.burgerGebeurtenissen.title", {name: formatBurgerName(burger)})} backButton={<BackButton to={AppRoutes.ViewBurger(id)} />}>
					<BurgerContextContainer burger={burger}/>
					<SectionContainer>
						<Section title={t("pages.gebeurtenissen.title")} helperText={t("pages.gebeurtenissen.helperTextBurger")} right={<PaginationButtons />}>
							<GebeurtenissenTableView gebeurtenissen={userActivities} />
						</Section>
					</SectionContainer>
				</Page>
			);
		}} />
	);
};

export default BurgerAuditLogPage;
