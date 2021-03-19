import React from "react";
import {useTranslation} from "react-i18next";
import Routes from "../../../config/routes";
import {Afspraak} from "../../../generated/graphql";
import BackButton from "../../BackButton";
import Page from "../../Layouts/Page";
import Section from "../../Layouts/Section";

const AfspraakDetailView: React.FC<{afspraak: Afspraak}> = ({afspraak}) => {
	const {t} = useTranslation();

	return (
		<Page title={t("__AfspraakDetailView")} backButton={<BackButton to={Routes.Burgers} />}>
			<Section>
				<pre>{JSON.stringify(afspraak, null, 2)}</pre>
			</Section>
		</Page>
	);
};

export default AfspraakDetailView;