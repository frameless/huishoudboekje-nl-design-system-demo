import React from "react";
import {Trans, useTranslation} from "react-i18next";
import Routes from "../../../config/routes";
import {GebruikersActiviteit} from "../../../generated/graphql";
import {formatBurgerName} from "../../../utils/things";
import AuditLogLink from "../AuditLogLink";

const ViewGebruiker: React.FC<{ g: GebruikersActiviteit }> = ({g}) => {
	const {t} = useTranslation();
	const burger = g.entities?.find(e => e.entityType === "burger")?.burger;

	const data = {
		gebruiker: g.gebruikerId,
		burger: formatBurgerName(burger),
	};

	return <Trans i18nKey={"auditLog.viewGebruiker"} values={data} components={{
		linkBurger: burger?.id ? <AuditLogLink to={Routes.Burger(burger.id)}>{formatBurgerName(burger)}</AuditLogLink> : t("unknownBurger"),
	}} />
}

export default ViewGebruiker;