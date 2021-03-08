import { Stack, StackProps } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Burger, GebruikersActiviteit, useGetBurgerGebeurtenissenQuery } from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import { FormLeft } from "../../Forms/FormLeftRight";
import GebeurtenissenTableView from "../../Gebeurtenissen/GebeurtenissenTableView";

const BurgerGebeurtenissen: React.FC<StackProps & { burger: Burger }> = ({burger, ...props}) => {
	const {t} = useTranslation();
	const $gebeurtenissen = useGetBurgerGebeurtenissenQuery({
		fetchPolicy: "no-cache",
		variables: { ids:  [burger.id || -1] }
	});

	return (
		<Stack {...props}>
			<FormLeft title={t("pages.gebeurtenissen.title")} helperText={t("pages.gebeurtenissen.helperTextBurger")} />
			<Queryable query={$gebeurtenissen} children={data => {
				const gs: GebruikersActiviteit[] = data.gebruikersactiviteiten || [];

				return <GebeurtenissenTableView gebeurtenissen={gs} />;
			}} />
		</Stack>
	);
};

export default BurgerGebeurtenissen;