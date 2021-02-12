import React from "react";
import {Trans, useTranslation} from "react-i18next";
import Routes from "../../../config/routes";
import {GebruikersActiviteit} from "../../../generated/graphql";
import AuditLogLink from "../AuditLogLink";

const CreateOrganisatie: React.FC<{ g: GebruikersActiviteit }> = ({g}) => {
	const {t} = useTranslation();
	const organisatie = g.entities?.find(e => e.entityType === "organisatie")?.organisatie;

	const data = {
		gebruiker: g.gebruikerId || t("unknownGebruiker"),
	};

	return <Trans i18nKey={"auditLog.createOrganisatie"} values={data} components={{
		linkOrganisatie: (organisatie?.id && organisatie?.weergaveNaam) ? <AuditLogLink to={Routes.Organisatie(organisatie.id)}>{organisatie.weergaveNaam}</AuditLogLink> : t("unknownOrganisatie")
	}} />;
};

export default CreateOrganisatie;