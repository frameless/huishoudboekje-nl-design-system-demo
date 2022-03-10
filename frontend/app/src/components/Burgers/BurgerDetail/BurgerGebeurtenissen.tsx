import React from "react";
import {useTranslation} from "react-i18next";
import {Burger, GebruikersActiviteit, useGetBurgerGebeurtenissenQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import usePagination from "../../../utils/usePagination";
import GebeurtenissenTableView from "../../Gebeurtenissen/GebeurtenissenTableView";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";

const BurgerGebeurtenissen: React.FC<{burger: Burger}> = ({burger}) => {
	const {t} = useTranslation();
	const {setTotal, pageSize, offset, PaginationButtons} = usePagination();
	const $gebeurtenissen = useGetBurgerGebeurtenissenQuery({
		variables: {
			ids: [burger.id!],
			limit: pageSize,
			offset: offset,
		},
		onCompleted: data => setTotal(data.gebruikersactiviteitenPaged?.pageInfo?.count),
	});

	return (
		<SectionContainer>
			<Queryable query={$gebeurtenissen} children={data => {
				const gs: GebruikersActiviteit[] = data.gebruikersactiviteitenPaged?.gebruikersactiviteiten || [];
				return (
					<Section title={t("pages.gebeurtenissen.title")} helperText={t("pages.gebeurtenissen.helperTextBurger")} right={<PaginationButtons />}>
						<GebeurtenissenTableView gebeurtenissen={gs} />
					</Section>
				);
			}} />
		</SectionContainer>
	);
};

export default BurgerGebeurtenissen;