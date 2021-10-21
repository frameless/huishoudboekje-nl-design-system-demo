import {
	Box,
	Button,
	FormLabel,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	Text,
	TextProps,
	useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import Routes from "../../config/routes";
import {Burger, GebruikersActiviteit} from "../../generated/graphql";
import {useFeatureFlag} from "../../utils/features";
import {formatBurgerName, formatHuishoudenName, humanJoin} from "../../utils/things";
import AuditLogLink from "./AuditLogLink";
import {auditLogTexts} from "./texts";

const AuditLogText: React.FC<TextProps & {g: GebruikersActiviteit}> = ({g, ...props}) => {
	const {t} = useTranslation();
	const {action, entities = []} = g;
	const {isOpen, onClose, onOpen} = useDisclosure();
	const isModalEnabled = useFeatureFlag("auditlogmodals");

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

	const burgerName = formatBurgerName(burger);
	const components = {
		linkBurger: burger?.id ? <AuditLogLink to={Routes.Burger(burger.id)}>{formatBurgerName(burger)}</AuditLogLink> : t("unknownBurger"),
		linkHuishouden: (huishouden && huishouden?.id) ?
			<AuditLogLink to={Routes.Huishouden(huishouden.id)}>{formatHuishoudenName(huishouden)}</AuditLogLink> : t("unknownHuishouden"),
		linkOrganisatie: organisatie?.id ? <AuditLogLink to={Routes.Organisatie(organisatie.id)}>{organisatie.naam}</AuditLogLink> : t("unknownOrganisatie"),
		linkAfspraak: afspraak?.id ? <AuditLogLink to={Routes.ViewAfspraak(afspraak.id)} /> : t("unknownAfspraak"),
		linkAfspraakOrganisatie: afspraak?.afdeling?.organisatie?.id ?
			<AuditLogLink to={Routes.Organisatie(afspraak?.afdeling?.organisatie?.id)}>{afspraak?.afdeling?.organisatie?.naam}</AuditLogLink> : t("unknownOrganisatie"),
		strong: <strong />,
	};

	const values = {
		gebruiker,
		burger: burgerName,
		// Todo: Find a solution for humanJoining an array of AuditLogLinks.
		listBurgers: (burgers && burgers.length > 0) ? humanJoin(burgers.map(b => formatBurgerName(b))) : t("unknownBurgers"),
		huishouden: huishouden && formatHuishoudenName(huishouden),
		organisatie: organisatie?.naam || t("unknownOrganisatie"),
		afspraakOrganisatie: afspraak?.afdeling?.organisatie?.naam,
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
	};

	const auditLogTextElement = auditLogTexts(values, components, action);

	const openModal = () => {
		// Modal is hidden behind a feature flag.
		if (isModalEnabled) {
			onOpen();
		}
	};

	const context = [
		g.gebruikerId,
		action,
		...entities.reduce<string[]>((result, e) => ([
			...result,
			`${e.entityType} (${e.entityId})`,
		]), []),
	];

	return (<>
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent maxW={"780px"} w={"100%"}>
				<ModalHeader>{g.id}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack>
						<Stack>
							<FormLabel>Sjabloon</FormLabel>
							{auditLogTextElement ? (
								<Text {...props}>{auditLogTextElement()}</Text>
							) : (<>
								<Text>{t("auditLog.unknown")}</Text>
								<Text fontSize={"sm"}>{context.join(", ")}</Text>
							</>)}
						</Stack>

						<Stack>
							<FormLabel>Ruwe data</FormLabel>
							<Box as={"pre"} p={2} bg={"gray.100"} maxWidth={"100%"} overflowX={"auto"}>{JSON.stringify({action, values, entities}, null, 2)}</Box>
						</Stack>
					</Stack>
				</ModalBody>

				<ModalFooter>
					<Button colorScheme={"primary"} onClick={onClose}>{t("global.actions.close")}</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>

		<Stack onClick={openModal}>
			{auditLogTextElement ? (
				<Text {...props}>{auditLogTextElement()}</Text>
			) : (<>
				<Text>{t("auditLog.unknown")}</Text>
				<Text fontSize={"sm"}>{context.join(", ")}</Text>
			</>)}
		</Stack>
	</>);
};

export default AuditLogText;