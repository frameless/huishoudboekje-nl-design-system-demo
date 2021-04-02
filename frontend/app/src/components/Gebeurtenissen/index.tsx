import {HStack, Stack, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {GebruikersActiviteit, useGetGebeurtenissenQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {paginationSettings} from "../../utils/things";
import usePagination from "../../utils/usePagination";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";
import GebeurtenissenTableView from "./GebeurtenissenTableView";

const Gebeurtenissen = () => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, true, false, false]);
	const {setTotal, pageSize, offset, PaginationButtons} = usePagination(paginationSettings(t, isMobile));

	const $gebeurtenissen = useGetGebeurtenissenQuery({
		variables: {
			limit: pageSize,
			offset,
		},
		onCompleted: data => {
			setTotal(data.gebruikersactiviteitenPaged?.pageInfo?.count || 0);
		},
	});

	return (
		<Page title={t("pages.gebeurtenissen.title")}>
			<Section>
				<Stack direction={["column", "row"]}>
					<FormLeft title={t("pages.gebeurtenissen.title")} helperText={t("pages.gebeurtenissen.helperText")} flex={1} />
					<FormRight flex={4}>
						<HStack justify={"center"}>
							<PaginationButtons />
						</HStack>

						<Queryable query={$gebeurtenissen} loading={false} children={data => {
							const gs: GebruikersActiviteit[] = data.gebruikersactiviteitenPaged?.gebruikersactiviteiten || [];
							return (
								<GebeurtenissenTableView gebeurtenissen={gs} />
							);
						}} />
					</FormRight>
				</Stack>
			</Section>
		</Page>
	);
};

export default Gebeurtenissen;