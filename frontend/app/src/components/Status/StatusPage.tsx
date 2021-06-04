import React from "react";
import {useTranslation} from "react-i18next";
import {FormLeft, FormRight} from "../Layouts/Forms";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";
import {ServicesStatus} from "./ServicesStatus";

const StatusPage = () => {
	const {t} = useTranslation();

	return (
		<Page title={t("statuspage.title")}>
			<Section direction={["column", "row"]}>
				<FormLeft title={t("statuspage.services.title")} helperText={t("statuspage.services.helperText")} />
				<FormRight>
					<ServicesStatus />
				</FormRight>
			</Section>
		</Page>
	);
};

export default StatusPage;