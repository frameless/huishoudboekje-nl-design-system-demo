import React from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {GebruikersActiviteit, useGetBurgerGebeurtenissenQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {formatBurgerName} from "../../utils/things";
import usePagination from "../../utils/usePagination";
import GebeurtenissenTableView from "../Gebeurtenissen/GebeurtenissenTableView";
import BackButton from "../shared/BackButton";
import Page from "../shared/Page";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";

const BurgerAuditLogPage = () => {
	const {id = ""} = useParams<{id: string}>();
	const {t} = useTranslation();
	const {setTotal, pageSize, offset, PaginationButtons} = usePagination();
	const $burgerGebeurtenissen = useGetBurgerGebeurtenissenQuery({
		variables: {
			ids: [parseInt(id)],
			limit: pageSize,
			offset: offset,
		},
		onCompleted: data => setTotal(data.gebruikersactiviteitenPaged?.pageInfo?.count),
	});

	return (
		<Queryable query={$burgerGebeurtenissen} children={data => {
			const burger = data.burgers?.[0];
			const gs: GebruikersActiviteit[] = data.gebruikersactiviteitenPaged?.gebruikersactiviteiten || [];
			return (
				<Page title={t("pages.burgerGebeurtenissen.title", {name: formatBurgerName(burger)})} backButton={<BackButton to={AppRoutes.ViewBurger(id)} />}>
					<SectionContainer>
						<Section title={t("pages.gebeurtenissen.title")} helperText={t("pages.gebeurtenissen.helperTextBurger")} right={<PaginationButtons />}>
							<GebeurtenissenTableView gebeurtenissen={gs} />
						</Section>
					</SectionContainer>
				</Page>
			);
		}} />
	);
};

export default BurgerAuditLogPage;
