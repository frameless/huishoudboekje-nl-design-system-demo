import {Box, Button, Divider, HStack, Stack, Text, TextProps, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {AppRoutes} from "../../config/routes";
import {Burger, GebruikersActiviteit} from "../../generated/graphql";
import {formatBurgerName, formatHuishoudenName, humanJoin} from "../../utils/things";
import DataItem from "../shared/DataItem";
import AuditLogLink from "./AuditLogLink";
import {auditLogTexts} from "./texts";
import Modal from "../shared/Modal";

const AuditLogText: React.FC<TextProps & { g: GebruikersActiviteit }> = ({g, ...props}) => {
	const {t} = useTranslation();
	const {action, entities = []} = g;
	const {isOpen, onClose, onOpen} = useDisclosure();

	const gebruiker = g.gebruikerId || t("unknownGebruiker");
	const burger = entities.find(e => e.entityType === "burger")?.burger;
	const burgers = entities.filter(e => e.entityType === "burger")?.map(b => b.burger as Burger);
	const huishouden = entities.find(e => e.entityType === "huishouden")?.huishouden;
	const afspraak = entities.find(e => e.entityType === "afspraak")?.afspraak;
	const organisatie = entities.find(e => e.entityType === "organisatie")?.organisatie;
	const transactions = entities.filter(e => e.entityType === "transactie");
	const customerStatementMessage = entities.find(e => e.entityType === "customerStatementMessage")?.customerStatementMessage;
	const csmId = entities.find(e => e.entityType === "customerStatementMessage")?.entityId;
	const rekening = entities.find(e => e.entityType === "rekening")?.rekening;
	const configuratie = entities.find(e => e.entityType === "configuratie")?.configuratie;
	const rubriek = entities.find(e => e.entityType === "rubriek")?.rubriek;
	const afdeling = entities.find(e => e.entityType === "afdeling")?.afdeling;
	const postadres = entities.find(e => e.entityType === "postadres")?.postadres;

	const burgerName = formatBurgerName(burger);
	const components = {
		linkBurger: burger?.id ? <AuditLogLink to={AppRoutes.ViewBurger(String(burger.id))}>{formatBurgerName(burger)}</AuditLogLink> : t("unknownBurger"),
		linkHuishouden: (huishouden && huishouden?.id) ?
			<AuditLogLink to={AppRoutes.Huishouden(String(huishouden.id))}>{formatHuishoudenName(huishouden)}</AuditLogLink> : t("unknownHuishouden"),
		linkOrganisatie: organisatie?.id ? <AuditLogLink to={AppRoutes.Organisatie(String(organisatie.id))}>{organisatie.naam}</AuditLogLink> : t("unknownOrganisatie"),
		linkAfspraak: afspraak?.id ? <AuditLogLink to={AppRoutes.ViewAfspraak(String(afspraak.id))} /> : t("unknownAfspraak"),
		linkAfspraakOrganisatie: afspraak?.afdeling?.organisatie?.id ?
			<AuditLogLink to={AppRoutes.Organisatie(String(afspraak?.afdeling?.organisatie?.id))}>{afspraak?.afdeling?.organisatie?.naam}</AuditLogLink> : t("unknownOrganisatie"),
		linkAfdeling: afdeling?.organisatie?.id && afdeling?.naam ?
			<AuditLogLink to={AppRoutes.Organisatie(String(afdeling.organisatie.id))}>{afdeling.naam}</AuditLogLink> : t("unknownAfdeling"),
		strong: <strong />,
	};

	const values = {
		gebruiker,
		burger: burgerName,
		// Todo: Find a solution for humanJoining an array of AuditLogLinks (10-08-2021)
		listBurgers: (burgers && burgers.length > 0) ? humanJoin(burgers.map(b => formatBurgerName(b))) : t("unknownBurgers"),
		huishouden: huishouden && formatHuishoudenName(huishouden),
		organisatie: organisatie?.naam || t("unknownOrganisatie"),
		isAfspraakWithBurger: !afspraak?.afdeling?.organisatie?.naam,
		afspraakOrganisatie: afspraak?.afdeling?.organisatie?.naam || t("unknownOrganisatie"),
		customerStatementMessage: customerStatementMessage?.filename || t("unknownCsm"),
		csmId,
		nTransactions: transactions.length || t("unknownCount"),
		nCsmTransactions: customerStatementMessage?.bankTransactions?.length || t("unknownCount"),
		transactieId: transactions?.[0]?.entityId || t("unknown"),
		iban: rekening?.iban || t("unknownIban"),
		rekeninghouder: rekening?.rekeninghouder || t("unknownRekeninghouder"),
		configuratieId: configuratie?.id || t("unknown"),
		configuratieWaarde: configuratie?.waarde || t("unknown"),
		rubriek: rubriek?.naam || t("unknownRubriek"),
		afdeling: afdeling?.naam || t("unknownAfdeling"),
		postadres: postadres?.id || t("unknownPostadres"),
	};

	const auditLogTextElement = auditLogTexts(values, components, action);

	const context = {
		action,
		gebruiker: g.gebruikerId,
		entities: entities.reduce<string[]>((result, e) => ([
			...result,
			`${e.entityType} (${e.entityId})`,
		]), []),
	};

	return (<>
		<Modal
			title={"Gebeurtenis #" + g.id}
			isOpen={isOpen}
			onClose={onClose}
			confirmButton={<Button colorScheme={"primary"} onClick={onClose}>{t("global.actions.close")}</Button>}
			size={"2xl"}
			showAsterisk={false}
			showCancelButton={false}
		>
			<Stack>
				<Stack>
					<DataItem label={"Sjabloon"}>
						<Text>
							{auditLogTextElement?.() || t("auditLog.unknown")}
						</Text>
					</DataItem>

					<Divider />

					<DataItem label={"Actie"}>{context.action}</DataItem>
					<DataItem label={"Gebruiker"}>{context.gebruiker ?? t("unknownUser")}</DataItem>
					<DataItem label={"Entiteiten"}>
						<Box as={"pre"} p={2} bg={"gray.100"} maxWidth={"100%"} overflowX={"auto"}>{JSON.stringify(context.entities, null, 2)}</Box>
					</DataItem>
					<DataItem label={"Waarden"}>
						<Box as={"pre"} p={2} bg={"gray.100"} maxWidth={"100%"} overflowX={"auto"}>{JSON.stringify(values, null, 2)}</Box>
					</DataItem>
				</Stack>
			</Stack>
		</Modal>

		<HStack onDoubleClick={() => onOpen()}>
			{auditLogTextElement ? (
				<Text {...props}>{auditLogTextElement()}</Text>
			) : (<>
				<Text color={"red.500"}>{t("auditLog.unknown")}</Text>
				<Text fontSize={"sm"}>{action}</Text>
			</>)}
		</HStack>
	</>);
};

export default AuditLogText;