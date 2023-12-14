import React from "react";
import {useTranslation} from "react-i18next";
import {GebruikersActiviteit, useGetGebeurtenissenQuery} from "../../generated/graphql";
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

	const $gebeurtenissen = useGetGebeurtenissenQuery({
		fetchPolicy: "cache-and-network",
		variables: {
			limit: pageSize,
			offset,
		},
		onCompleted: data => setTotal(data.gebruikersactiviteitenPaged?.pageInfo?.count || 0),
	});

	return (
		<Page title={t("pages.gebeurtenissen.title")}>
			<Queryable query={$gebeurtenissen} children={data => {
				const gs: GebruikersActiviteit[] = data.gebruikersactiviteitenPaged?.gebruikersactiviteiten || [];
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