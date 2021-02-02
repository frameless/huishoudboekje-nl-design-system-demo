import {Text, TextProps} from "@chakra-ui/react";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import Routes from "../../config/routes";
import {GebruikersActiviteit} from "../../generated/graphql";
import {formatBurgerName} from "../../utils/things";

const AuditLogText: React.FC<TextProps & { g: GebruikersActiviteit }> = ({g, ...props}) => {
	const {t} = useTranslation();
	const {action} = g;

	if (!action) {
		return t("auditLog.unknown");
	}

	const auditLogTextConfig: Record<string, () => JSX.Element> = {
		createGebruiker: () => {
			const burger = g.entities?.find(e => e.entityType === "burger")?.burger;
			const data = {
				gebruikerNaam: g.gebruikerId,
				burgerNaam: burger ? formatBurgerName(burger, true) : "unknown"
			};

			return <Trans i18nKey={"auditLog.createGebruiker"} values={data} components={{
				burgerLink: burger ? <NavLink to={Routes.Burger(burger.id)}>{}</NavLink> : t("unknown")
			}} />;
		},
		deleteGebruiker: () => <></>,
		updateGebruiker: () => <></>,
		createAfspraak: () => <></>,
		updateAfspraak: () => <></>,
		deleteAfspraak: () => <></>,
		createOrganisatie: () => <></>,
		updateOrganisatie: () => <></>,
		deleteOrganisatie: () => <></>,
		createGebruikerRekening: () => <></>,
		deleteGebruikerRekening: () => <></>,
		createOrganisatieRekening: () => <></>,
		deleteOrganisatieRekening: () => <></>,
		createJournaalpostAfspraak: () => <></>,
		createJournaalpostGrootboekrekening: () => <></>,
		updateJournaalpostGrootboekrekening: () => <></>,
		deleteJournaalpost: () => <></>,
		createRubriek: () => <></>,
		updateRubriek: () => <></>,
		deleteRubriek: () => <></>,
		createConfiguratie: () => <></>,
		updateConfiguratie: () => <></>,
		deleteConfiguratie: () => <></>,
		updateRekening: () => <></>,
		deleteCustomerStatementMessage: () => <></>,
		createCustomerStatementMessage: () => <></>,
		createExportOverschrijvingene: () => <></>,
	};

	const auditLogTextConfigElement = auditLogTextConfig[action];

	if(!auditLogTextConfigElement){
		return t("auditLog.unknown");
	}

	return (
		<Text {...props}>{auditLogTextConfigElement()}</Text>
	);
}

export default AuditLogText;