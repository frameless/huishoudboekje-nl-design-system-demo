import React from "react";
import {useTranslation} from "react-i18next";
import Page from "../shared/Page";
import Parameters from "./Parameters";
import Rubrieken from "./Rubrieken";

const Configuratie = () => {
	const {t} = useTranslation();

	return (
		<Page title={t("configuratie")}>
			<Parameters />
			<Rubrieken />
		</Page>
	);
};

export default Configuratie;