import React from "react";
import {Trans, useTranslation} from "react-i18next";
import Routes from "../../../config/routes";
import {GebruikersActiviteit} from "../../../generated/graphql";
import {formatBurgerName} from "../../../utils/things";
import AuditLogLink from "../AuditLogLink";

const ViewAfspraak: React.FC<{ g: GebruikersActiviteit}> = ({g}) => {
	const {t} = useTranslation();
	const burger = g.entities?.find(e => e.entityType === "burger")?.burger;
	const afspraak = g.entities?.find(e => e.entityType === "afspraak")?.afspraak;
	const organisatie = afspraak?.organisatie;

	const data = {
		gebruiker: g.gebruikerId || t("unknownGebruiker"),
		burger: formatBurgerName(burger),
		organisatie: organisatie?.weergaveNaam,
	};

	return <Trans i18nKey={"auditLog.viewAfspraak"} values={data} components={{
		linkBurger: burger?.id ? <AuditLogLink to={Routes.Burger(burger.id)}>{formatBurgerName(burger)}</AuditLogLink> : t("unknownBurger"),
		linkOrganisatie: organisatie?.id ? <AuditLogLink to={Routes.Organisatie(organisatie.id)}>{organisatie.weergaveNaam}</AuditLogLink> : t("unknownOrganisatie"),
		linkAfspraak: afspraak?.id ? <AuditLogLink to={Routes.EditAfspraak(afspraak.id)} /> : t("unknownAfspraak"),
	}} />
}

export default ViewAfspraak;