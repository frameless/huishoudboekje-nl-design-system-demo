import React from "react";
import {useTranslation} from "react-i18next";
import {GebruikersActiviteit, useGetGebeurtenissenQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {FormLeft} from "../Forms/FormLeftRight";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";
import GebeurtenissenTableView from "./GebeurtenissenTableView";

const Gebeurtenissen = () => {
	const {t} = useTranslation();
	const $gebeurtenissen = useGetGebeurtenissenQuery({
		fetchPolicy: "no-cache"
	});

	return (
		<Page title={t("pages.gebeurtenissen.title")}>

			<Section>
				<FormLeft title={t("pages.gebeurtenissen.title")} helperText={t("pages.gebeurtenissen.helperText")} />
				<Queryable query={$gebeurtenissen} children={data => {
					const gs: GebruikersActiviteit[] = data.gebruikersactiviteiten || [];
					return <GebeurtenissenTableView gebeurtenissen={gs} />;
				}} />
			</Section>

		</Page>
	);
};

export default Gebeurtenissen;