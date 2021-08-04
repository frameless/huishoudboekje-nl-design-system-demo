import {Stack, Text, TextProps} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import Routes from "../../config/routes";
import {GebruikersActiviteit} from "../../generated/graphql";
import {formatBurgerName} from "../../utils/things";
import AuditLogLink from "./AuditLogLink";
import {auditLogTexts} from "./texts";

const AuditLogText: React.FC<TextProps & {g: GebruikersActiviteit}> = ({g, ...props}) => {
	const {t} = useTranslation();
	const {action, entities = []} = g;

	const gebruiker = g.gebruikerId || t("unknownGebruiker");
	const burger = entities.find(e => e.entityType === "burger")?.burger;
	const afspraak = entities.find(e => e.entityType === "afspraak")?.afspraak;
	const organisatie = entities.find(e => e.entityType === "organisatie")?.organisatie;
	const transactions = entities.filter(e => e.entityType === "transactie");
	const customerStatementMessage = entities.find(e => e.entityType === "customerStatementMessage");
	const rekening = entities.find(e => e.entityType === "rekening")?.rekening;
	const configuratie = entities.find(e => e.entityType === "configuratie")?.configuratie;

	const burgerName = formatBurgerName(burger);

	const components = {
		linkBurger: burger?.id ? <AuditLogLink to={Routes.Burger(burger.id)}>{formatBurgerName(burger)}</AuditLogLink> : t("unknownBurger"),
		linkOrganisatie: organisatie?.id ? <AuditLogLink to={Routes.Organisatie(organisatie.id)}>{organisatie.kvkDetails?.naam}</AuditLogLink> : t("unknownOrganisatie"),
		linkAfspraak: afspraak?.id ? <AuditLogLink to={Routes.ViewAfspraak(afspraak.id)} /> : t("unknownAfspraak"),
		linkAfspraakOrganisatie: afspraak?.organisatie?.id ?
			<AuditLogLink to={Routes.Organisatie(afspraak?.organisatie?.id)}>{afspraak?.organisatie.kvkDetails?.naam}</AuditLogLink> : t("unknownOrganisatie"),
		strong: <strong />,
	};

	const values = {
		gebruiker,
		burger: burgerName,
		organisatie: organisatie?.kvkDetails?.naam || t("unknownOrganisatie"),
		afspraakOrganisatie: afspraak?.organisatie?.kvkDetails?.naam,
		customerStatementMessage: customerStatementMessage?.entityId || "?",
		nTransactions: transactions.length || t("unknown"),
		transactieId: transactions?.[0]?.entityId || t("unknown"),
		iban: rekening?.iban || t("unknownIban"),
		rekeninghouder: rekening?.rekeninghouder || t("unknownRekeninghouder"),
		configuratieId: configuratie?.id || t("unknown"),
		configuratieWaarde: configuratie?.waarde || t("unknown"),
	};

	const auditLogTextElement = auditLogTexts(values, components, action);

	const context = [
		g.gebruikerId,
		action,
		...entities.reduce<string[]>((result, e) => ([
			...result,
			`${e.entityType} (${e.entityId})`,
		]), []),
	];

	return auditLogTextElement ? (
		<Text {...props}>{auditLogTextElement()}</Text>
	) : (
		<Stack spacing={1}>
			<Text>{t("auditLog.unknown")}</Text>
			<Text fontSize={"sm"}>{context.join(", ")}</Text>
		</Stack>
	);
};

export default AuditLogText;