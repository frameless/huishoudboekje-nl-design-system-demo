import {Stack, Text, TextProps} from "@chakra-ui/react";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import Routes from "../../config/routes";
import {GebruikersActiviteit} from "../../generated/graphql";
import {formatBurgerName} from "../../utils/things";
import AuditLogLink from "./AuditLogLink";

const AuditLogText: React.FC<TextProps & {g: GebruikersActiviteit}> = ({g, ...props}) => {
	const {t} = useTranslation();
	const {action, entities = []} = g;

	const gebruiker = g.gebruikerId || t("unknownGebruiker");
	const burger = entities.find(e => e.entityType === "burger")?.burger;
	const afspraak = entities.find(e => e.entityType === "afspraak")?.afspraak;
	const organisatie = entities.find(e => e.entityType === "organisatie")?.organisatie;
	const transactions = entities.filter(e => e.entityType === "transaction");
	const customerStatementMessage = entities.find(e => e.entityType === "customerStatementMessage");

	const burgerName = formatBurgerName(burger);

	const components = {
		linkBurger: burger?.id ? <AuditLogLink to={Routes.Burger(burger.id)}>{formatBurgerName(burger)}</AuditLogLink> : t("unknownBurger"),
		linkOrganisatie: organisatie?.id ? <AuditLogLink to={Routes.Organisatie(organisatie.id)}>{organisatie.weergaveNaam}</AuditLogLink> : t("unknownOrganisatie"),
		linkAfspraak: afspraak?.id ? <AuditLogLink to={Routes.EditAfspraak(afspraak.id)} /> : t("unknownAfspraak"),
		linkAfspraakOrganisatie: afspraak?.organisatie?.id ?
			<AuditLogLink to={Routes.Organisatie(afspraak?.organisatie?.id)}>{afspraak?.organisatie.weergaveNaam}</AuditLogLink> : t("unknownOrganisatie"),
		strong: <strong />,
	};

	const values = {
		gebruiker,
		burger: burgerName,
		organisatie: organisatie?.weergaveNaam || t("unknownOrganisatie"),
		afspraakOrganisatie: afspraak?.organisatie?.weergaveNaam || t("unknownOrganisatie"),
		customerStatementMessage: customerStatementMessage?.entityId || "?",
		nTransactions: transactions.length || t("unknown"),
	};

	if (action) {
		const auditLogTextConfig: Record<string, () => JSX.Element> = {
			organisatie: () => <Trans i18nKey={"auditLog.viewOrganisatie"} values={values} components={components} />,
			organisaties: () => <Trans i18nKey={"auditLog.viewOrganisaties"} values={values} components={components} />,
			afspraak: () => <Trans i18nKey={"auditLog.viewAfspraak"} values={values} components={components} />,
			afspraken: () => <Trans i18nKey={"auditLog.viewAfspraken"} values={values} components={components} />,
			rubrieken: () => <Trans i18nKey={"auditLog.viewRubrieken"} values={values} components={components} />,
			gebruiker: () => <Trans i18nKey={"auditLog.viewGebruiker"} values={values} components={components} />,
			gebruikers: () => <Trans i18nKey={"auditLog.viewGebruikers"} values={values} components={components} />,
			customerStatementMessages: () => <Trans i18nKey={"auditLog.viewCustomerStatementMessages"} values={values} components={components} />,
			bankTransactions: () => <Trans i18nKey={"auditLog.viewTransactions"} values={values} components={components} />,
			exports: () => <Trans i18nKey={"auditLog.viewExports"} values={values} components={components} />,
			createGebruiker: () => <Trans i18nKey={"auditLog.createGebruiker"} values={values} components={components} />,
			updateGebruiker: () => <Trans i18nKey={"auditLog.updateGebruiker"} values={values} components={components} />,
			deleteGebruiker: () => <Trans i18nKey={"auditLog.deleteGebruiker"} values={values} components={components} />,
			createAfspraak: () => <Trans i18nKey={"auditLog.createAfspraak"} values={values} components={components} />,
			updateAfspraak: () => <Trans i18nKey={"auditLog.updateAfspraak"} values={values} components={components} />,
			deleteAfspraak: () => <Trans i18nKey={"auditLog.deleteAfspraak"} values={values} components={components} />,
			updateRekening: () => <Trans i18nKey={"auditLog.updateRekening"} values={values} components={components} />,
			createOrganisatie: () => <Trans i18nKey={"auditLog.createOrganisatie"} values={values} components={components} />,
			updateOrganisatie: () => <Trans i18nKey={"auditLog.updateOrganisatie"} values={values} components={components} />,
			deleteOrganisatie: () => <Trans i18nKey={"auditLog.deleteOrganisatie"} values={values} components={components} />,
			createJournaalpostAfspraak: () => <Trans i18nKey={"auditLog.createJournaalpostAfspraak"} values={values} components={components} />,
			createJournaalpostGrootboekrekening: () => <Trans i18nKey={"auditLog.createJournaalpostGrootboekrekening"} values={values} components={components} />,
			updateJournaalpostGrootboekrekening: () => <Trans i18nKey={"auditLog.updateJournaalpostGrootboekrekening"} values={values} components={components} />,
			deleteJournaalpost: () => <Trans i18nKey={"auditLog.deleteJournaalpost"} values={values} components={components} />,
			createRubriek: () => <Trans i18nKey={"auditLog.createRubriek"} values={values} components={components} />,
			updateRubriek: () => <Trans i18nKey={"auditLog.updateRubriek"} values={values} components={components} />,
			deleteRubriek: () => <Trans i18nKey={"auditLog.deleteRubriek"} values={values} components={components} />,
			createConfiguratie: () => <Trans i18nKey={"auditLog.createConfiguratie"} values={values} components={components} />,
			updateConfiguratie: () => <Trans i18nKey={"auditLog.updateConfiguratie"} values={values} components={components} />,
			deleteConfiguratie: () => <Trans i18nKey={"auditLog.deleteConfiguratie"} values={values} components={components} />,
			deleteCustomerStatementMessage: () => <Trans i18nKey={"auditLog.deleteCustomerStatementMessage"} values={values} components={components} />,
			createCustomerStatementMessage: () => <Trans i18nKey={"auditLog.createCustomerStatementMessage"} values={values} components={components} />,
			// createExportOverschrijvingen: () => <Trans i18nKey={"auditLog.createExportOverschrijvingen"} values={values} components={components} />,
			// createGebruikerRekening: () => <Trans i18nKey={"auditLog.createGebruikerRekening"} values={values} components={components} />,
			// deleteGebruikerRekening: () => <Trans i18nKey={"auditLog.deleteGebruikerRekening"} values={values} components={components} />,
			// createOrganisatieRekening: () => <Trans i18nKey={"auditLog.createOrganisatieRekening"} values={values} components={components} />,
			// deleteOrganisatieRekening: () => <Trans i18nKey={"auditLog.deleteOrganisatieRekening"} values={values} components={components} />,
		};

		const auditLogTextConfigElement = auditLogTextConfig[action];

		if (auditLogTextConfigElement) {
			return (
				<Text {...props}>{auditLogTextConfigElement()}</Text>
			);
		}
	}

	const context = [
		g.gebruikerId,
		action,
		...entities.reduce((result, e) => ([
			...result,
			`${e.entityType} (${e.entityId})`,
		]), [] as string[]),
	];
	return (
		<Stack spacing={1}>
			<Text>{t("auditLog.unknown")}</Text>
			<Text fontSize={"sm"}>{context.join(", ")}</Text>
		</Stack>
	);
};

export default AuditLogText;