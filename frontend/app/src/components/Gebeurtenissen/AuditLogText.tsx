import {Box, Link, Text, TextProps} from "@chakra-ui/react";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import Routes from "../../config/routes";
import {GebruikersActiviteit} from "../../generated/graphql";
import {formatBurgerName} from "../../utils/things";

const AuditLogLink = (props) => <Link as={NavLink} variant={"inline"} {...props} />

const AuditLogText: React.FC<TextProps & { g: GebruikersActiviteit }> = ({g, ...props}) => {
	const {t} = useTranslation();
	const {action, entities = []} = g;

	if (action) {
		const auditLogTextConfig: Record<string, () => JSX.Element> = {
			createGebruiker: () => {
				const burger = g.entities?.find(e => e.entityType === "burger")?.burger;
				const data = {
					gebruiker: g.gebruikerId || t("unknownGebruiker"),
					burger: formatBurgerName(burger)
				};

				return <Trans i18nKey={"auditLog.createGebruiker"} values={data} components={{
					linkBurger: burger ? <AuditLogLink to={Routes.Burger(burger.id)}>{formatBurgerName(burger)}</AuditLogLink> : t("unknown")
				}} />;
			},
			// deleteGebruiker: () => <>deleteGebruiker</>,
			// updateGebruiker: () => <>updateGebruiker</>,
			// createAfspraak: () => <>createAfspraak</>,
			updateAfspraak: () => {
				const organisatie = g.entities?.find(e => e.entityType === "organisatie")?.organisatie;
				const burger = g.entities?.find(e => e.entityType === "burger")?.burger;

				const data = {
					gebruiker: g.gebruikerId,
					burger: formatBurgerName(burger),
					organisatie: organisatie?.weergaveNaam,
				};

				return <Trans i18nKey={"auditLog.updateAfspraak"} values={data} components={{
					linkBurger: burger?.id ? <AuditLogLink to={Routes.Burger(burger.id)}>{formatBurgerName(burger)}</AuditLogLink> : t("unknown"),
					linkOrganisatie: organisatie?.id ? <AuditLogLink to={Routes.Organisatie(organisatie.id)}>{organisatie.weergaveNaam}</AuditLogLink> : t("unknown"),
				}} />
			},
			// deleteAfspraak: () => <>deleteAfspraak</>,
			// createOrganisatie: () => <>createOrganisatie</>,
			// updateOrganisatie: () => <>updateOrganisatie</>,
			// deleteOrganisatie: () => <>deleteOrganisatie</>,
			// createGebruikerRekening: () => <>createGebruikerRekening</>,
			// deleteGebruikerRekening: () => <>deleteGebruikerRekening</>,
			// createOrganisatieRekening: () => <>createOrganisatieRekening</>,
			// deleteOrganisatieRekening: () => <>deleteOrganisatieRekening</>,
			// createJournaalpostAfspraak: () => <>createJournaalpostAfspraak</>,
			// createJournaalpostGrootboekrekening: () => <>createJournaalpostGrootboekrekening</>,
			// updateJournaalpostGrootboekrekening: () => <>updateJournaalpostGrootboekrekening</>,
			// deleteJournaalpost: () => <>deleteJournaalpost</>,
			// createRubriek: () => <>createRubriek</>,
			// updateRubriek: () => <>updateRubriek</>,
			// deleteRubriek: () => <>deleteRubriek</>,
			// createConfiguratie: () => <>createConfiguratie</>,
			// updateConfiguratie: () => <>updateConfiguratie</>,
			// deleteConfiguratie: () => <>deleteConfiguratie</>,
			// updateRekening: () => <>updateRekening</>,
			// deleteCustomerStatementMessage: () => <>deleteCustomerStatementMessage</>,
			// createCustomerStatementMessage: () => <>createCustomerStatementMessage</>,
			// createExportOverschrijvingene: () => <>createExportOverschrijvingene</>,
		};

		const auditLogTextConfigElement = auditLogTextConfig[action];

		if (auditLogTextConfigElement) {
			return <Text {...props}>{auditLogTextConfigElement()}</Text>
		}
	}

	const context = [
		g.gebruikerId,
		action,
		...entities.reduce((result, e) => ([
			...result,
			`${e.entityType} (${e.entityId})`
		]), [] as string[])
	];
	return (
		<Box>
			<Text>{t("auditLog.unknown")}</Text>
			<Text fontSize={"xs"}>{context.join(", ")}</Text>
		</Box>
	);
};

export default AuditLogText;