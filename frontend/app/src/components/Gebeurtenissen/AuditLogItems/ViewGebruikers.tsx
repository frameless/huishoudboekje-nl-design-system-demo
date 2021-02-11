import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {GebruikersActiviteit} from "../../../generated/graphql";

const ViewGebruikers: React.FC<{ g: GebruikersActiviteit }> = ({g}) => {
	const {t} = useTranslation();

	const data = {
		gebruiker: g.gebruikerId || t("unknownGebruiker"),
	};

	return <Trans i18nKey={"auditLog.viewGebruikers"} values={data} />
}

export default ViewGebruikers;