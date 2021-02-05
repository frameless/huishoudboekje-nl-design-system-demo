import React from "react";
import {Trans, useTranslation} from "react-i18next";
import Routes from "../../../config/routes";
import {GebruikersActiviteit} from "../../../generated/graphql";
import {formatBurgerName} from "../../../utils/things";
import AuditLogLink from "../AuditLogLink";

const CreateJournaalpostAfspraak: React.FC<{ g: GebruikersActiviteit }> = ({g}) => {
	const {t} = useTranslation();
	const burger = g.entities?.find(e => e.entityType === "burger")?.burger;
	const afspraak = g.entities?.find(e => e.entityType === "afspraak")?.afspraak;

	const data = {
		gebruiker: g.gebruikerId,
		burger: formatBurgerName(burger),
		organisatie: afspraak?.organisatie?.weergaveNaam,
	};

	return <Trans i18nKey={"auditLog.createJournaalpostAfspraak"} values={data} components={{
		linkBurger: burger?.id ? <AuditLogLink to={Routes.Burger(burger.id)}>{formatBurgerName(burger)}</AuditLogLink> : t("unknownBurger"),
		linkOrganisatie: afspraak?.organisatie?.id ? <AuditLogLink to={Routes.Organisatie(afspraak?.organisatie?.id)}>{afspraak?.organisatie.weergaveNaam}</AuditLogLink> : t("unknownOrganisatie"),
		linkAfspraak: afspraak?.id ? <AuditLogLink to={Routes.EditAfspraak(afspraak.id)} /> : t("unknownAfspraak"),
	}} />
}

export default CreateJournaalpostAfspraak;