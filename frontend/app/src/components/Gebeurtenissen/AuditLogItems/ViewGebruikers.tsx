import React from "react";
import {Trans, useTranslation} from "react-i18next";
import Routes from "../../../config/routes";
import {GebruikersActiviteit} from "../../../generated/graphql";
import {formatBurgerName} from "../../../utils/things";
import AuditLogLink from "../AuditLogLink";

const ViewGebruikers: React.FC<{ g: GebruikersActiviteit }> = ({g}) => {
	const data = {
		gebruiker: g.gebruikerId,
	};

	return <Trans i18nKey={"auditLog.viewGebruikers"} values={data} />
}

export default ViewGebruikers;