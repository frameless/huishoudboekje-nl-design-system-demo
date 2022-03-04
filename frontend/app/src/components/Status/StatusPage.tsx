import React from "react";
import {useTranslation} from "react-i18next";
import {FormLeft, FormRight} from "../shared/Forms";
import Page from "../shared/Page";
import {DeprecatedSection} from "../shared/Section";
import {ServicesStatus} from "./ServicesStatus";

const StatusPage = () => {
	const {t} = useTranslation();

	return (
		<Page title={t("statuspage.title")}>
			<DeprecatedSection direction={["column", "row"]}>
				<FormLeft title={t("statuspage.services.title")} helperText={t("statuspage.services.helperText")} />
				<FormRight>
					<ServicesStatus />
				</FormRight>
			</DeprecatedSection>
		</Page>
	);
};

export default StatusPage;