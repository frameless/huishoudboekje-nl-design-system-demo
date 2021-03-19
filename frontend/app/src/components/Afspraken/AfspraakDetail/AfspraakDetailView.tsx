import React from "react";
import {useTranslation} from "react-i18next";
import useDeleteAfspraakAction from "../../../actions/deleteAfspraak";
import Routes from "../../../config/routes";
import {Afspraak} from "../../../generated/graphql";
import BackButton from "../../BackButton";
import Page from "../../Layouts/Page";
import Section from "../../Layouts/Section";
import AfspraakDetailMenu from "./AfspraakDetailMenu";

const AfspraakDetailView: React.FC<{afspraak: Afspraak}> = ({afspraak}) => {
	const {t} = useTranslation();
	const deleteAfspraak = useDeleteAfspraakAction(afspraak);
	const menu = <AfspraakDetailMenu afspraak={afspraak} onDelete={() => deleteAfspraak()} />;

	return (
		<Page title={t("__AfspraakDetailView")} backButton={<BackButton to={Routes.Burgers} />} menu={menu}>
			<Section>
				<pre>{JSON.stringify(afspraak, null, 2)}</pre>
			</Section>
		</Page>
	);
};

export default AfspraakDetailView;