import {HStack, Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {GebruikersActiviteit, useGetGebeurtenissenQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import usePagination from "../../utils/usePagination";
import Page from "../shared/Page";
import {FormLeft, FormRight} from "../shared/Forms";
import Section from "../shared/Section";
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
			<Section>
				<Stack>
					<FormLeft title={t("pages.gebeurtenissen.title")} helperText={t("pages.gebeurtenissen.helperText")} flex={1} />
					<Queryable query={$gebeurtenissen} children={data => {
						const gs: GebruikersActiviteit[] = data.gebruikersactiviteitenPaged?.gebruikersactiviteiten || [];
						return (
							<FormRight flex={4}>
								<GebeurtenissenTableView gebeurtenissen={gs} />
								<HStack justify={"center"}>
									<PaginationButtons />
								</HStack>
							</FormRight>
						);
					}} />
				</Stack>
			</Section>
		</Page>
	);
};

export default Gebeurtenissen;