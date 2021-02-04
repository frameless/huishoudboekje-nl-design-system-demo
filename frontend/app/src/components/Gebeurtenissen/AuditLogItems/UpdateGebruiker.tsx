import React from "react";
import {Trans, useTranslation} from "react-i18next";
import Routes from "../../../config/routes";
import {GebruikersActiviteit} from "../../../generated/graphql";
import {formatBurgerName} from "../../../utils/things";
import AuditLogLink from "../AuditLogLink";

const UpdateGebruiker: React.FC<{ g: GebruikersActiviteit }> = ({g}) => {
	const {t} = useTranslation();

	const burger = g.entities?.find(e => e.entityType === "burger")?.burger;
	const data = {
		gebruiker: g.gebruikerId || t("unknownGebruiker"),
		burger: formatBurgerName(burger)
	};

	return <Trans i18nKey={"auditLog.updateGebruiker"} values={data} components={{
		linkBurger: burger ? <AuditLogLink to={Routes.Burger(burger.id)}>{formatBurgerName(burger)}</AuditLogLink> : t("unknownBurger")
	}} />;
};

export default UpdateGebruiker;