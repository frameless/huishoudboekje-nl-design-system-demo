import {Stack, StackProps} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Gebruiker, GebruikersActiviteit, useGetGebeurtenissenQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {FormLeft} from "../../Forms/FormLeftRight";
import GebeurtenissenTableView from "../../Gebeurtenissen/GebeurtenissenTableView";

const BurgerGebeurtenissen: React.FC<StackProps & { burger: Gebruiker }> = ({burger, ...props}) => {
	const {t} = useTranslation();
	const $gebeurtenissen = useGetGebeurtenissenQuery({
		fetchPolicy: "no-cache"
	});

	return (
		<Stack {...props}>
			<FormLeft title={t("pages.gebeurtenissen.title")} helperText={t("pages.gebeurtenissen.helperTextBurger")} />
			<Queryable query={$gebeurtenissen} children={data => {
				const gs: GebruikersActiviteit[] = data.gebruikersactiviteiten || [];

				// Find only Gebruikersactiviteiten that have an entity for the current burger.
				const burgerGs = gs.filter(g => {
					const burgerEntities = g.entities?.filter(e => e.entityType === "burger" && e.entityId === burger.id) || [];
					return burgerEntities.length > 0;
				});

				return <GebeurtenissenTableView gebeurtenissen={burgerGs} />;
			}} />
		</Stack>
	);
};

export default BurgerGebeurtenissen;