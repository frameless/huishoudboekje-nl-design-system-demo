import {HStack, Stack, StackProps, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Burger, GebruikersActiviteit, useGetBurgerGebeurtenissenQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {paginationSettings} from "../../../utils/things";
import usePagination from "../../../utils/usePagination";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";
import GebeurtenissenTableView from "../../Gebeurtenissen/GebeurtenissenTableView";

const BurgerGebeurtenissen: React.FC<StackProps & {burger: Burger}> = ({burger, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, true, true, false]);
	const {pageSize, offset, setTotal, PaginationButtons} = usePagination(paginationSettings(t, isMobile));
	const $gebeurtenissen = useGetBurgerGebeurtenissenQuery({
		variables: {
			ids: [burger.id!],
			limit: pageSize,
			offset: offset,
		},
		onCompleted: data => setTotal(data.gebruikersactiviteitenPaged?.pageInfo?.count),
	});

	return (
		<Stack direction={["column", "row"]} {...props}>
			<FormLeft title={t("pages.gebeurtenissen.title")} helperText={t("pages.gebeurtenissen.helperTextBurger")} />
			<Queryable query={$gebeurtenissen} children={data => {
				const gs: GebruikersActiviteit[] = data.gebruikersactiviteitenPaged?.gebruikersactiviteiten || [];

				return (
					<FormRight>
						<HStack justify={"center"}>
							<PaginationButtons />
						</HStack>
						<GebeurtenissenTableView gebeurtenissen={gs} />
					</FormRight>
				);
			}} />
		</Stack>
	);
};

export default BurgerGebeurtenissen;