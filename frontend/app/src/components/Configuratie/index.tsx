import {Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import Page from "../shared/Page";
import {DeprecatedSection} from "../shared/Section";
import Parameters from "./Parameters";
import Rubrieken from "./Rubrieken";

const Configuratie = () => {
	const {t} = useTranslation();

	return (
		<Page title={t("configuratie")}>
			<Stack spacing={5}>
				<DeprecatedSection title={t("configuratie")}>
					<Parameters />
				</DeprecatedSection>
				<DeprecatedSection title={t("rubrieken")}>
					<Rubrieken />
				</DeprecatedSection>
			</Stack>
		</Page>
	);
};

export default Configuratie;