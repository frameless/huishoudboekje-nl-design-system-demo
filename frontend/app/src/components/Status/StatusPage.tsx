import React from "react";
import {useTranslation} from "react-i18next";
import Page from "../shared/Page";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import ServicesStatus from "./ServicesStatus";

const StatusPage = () => {
	const {t} = useTranslation();

	return (
		<Page title={t("statuspage.title")}>
			<SectionContainer>
				<Section title={t("statuspage.services.title")} helperText={t("statuspage.services.helperText")}>
					<ServicesStatus />
				</Section>
			</SectionContainer>
		</Page>
	);
};

export default StatusPage;