import {Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";
import Parameters from "./Parameters";
import Rubrieken from "./Rubrieken";

const Configuratie = () => {
	const {t} = useTranslation();

	return (
		<Page title={t("configuratie")}>
			<Stack spacing={5}>
				<Section title={t("configuratie")}>
					<Parameters />
				</Section>
				<Section title={t("rubrieken")}>
					<Rubrieken />
				</Section>
			</Stack>
		</Page>
	);
};

export default Configuratie;