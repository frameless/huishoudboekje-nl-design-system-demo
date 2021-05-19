import {HStack, Stack, StackProps} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Burger, GebruikersActiviteit, useGetBurgerGebeurtenissenQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import usePagination from "../../../utils/usePagination";
import GebeurtenissenTableView from "../../Gebeurtenissen/GebeurtenissenTableView";
import {FormLeft, FormRight} from "../../Layouts/Forms";

const BurgerGebeurtenissen: React.FC<StackProps & {burger: Burger}> = ({burger, ...props}) => {
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