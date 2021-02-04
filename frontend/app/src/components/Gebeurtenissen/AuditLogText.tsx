import {Box, Text, TextProps} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {GebruikersActiviteit} from "../../generated/graphql";
import CreateAfspraak from "./AuditLogItems/CreateAfspraak";
import CreateGebruiker from "./AuditLogItems/CreateGebruiker";
import CreateJournaalpostAfspraak from "./AuditLogItems/CreateJournaalpostAfspraak";
import DeleteJournaalpostAfspraak from "./AuditLogItems/DeleteJournaalpostAfspraak";
import UpdateAfspraak from "./AuditLogItems/UpdateAfspraak";
import UpdateGebruiker from "./AuditLogItems/UpdateGebruiker";

const AuditLogText: React.FC<TextProps & { g: GebruikersActiviteit }> = ({g, ...props}) => {
	const {t} = useTranslation();
	const {action, entities = []} = g;

	if (action) {
		const auditLogTextConfig: Record<string, () => JSX.Element> = {
			createGebruiker: () => <CreateGebruiker g={g} />,
			// deleteGebruiker: () => <>deleteGebruiker</>,
			updateGebruiker: () => <UpdateGebruiker g={g} />,
			createAfspraak: () => <CreateAfspraak g={g} />,
			updateAfspraak: () => <UpdateAfspraak g={g} />,
			// deleteAfspraak: () => <>deleteAfspraak</>,
			// createOrganisatie: () => <>createOrganisatie</>,
			// updateOrganisatie: () => <>updateOrganisatie</>,
			// deleteOrganisatie: () => <>deleteOrganisatie</>,
			// createGebruikerRekening: () => <>createGebruikerRekening</>,
			// deleteGebruikerRekening: () => <>deleteGebruikerRekening</>,
			// createOrganisatieRekening: () => <>createOrganisatieRekening</>,
			// deleteOrganisatieRekening: () => <>deleteOrganisatieRekening</>,
			createJournaalpostAfspraak: () => <CreateJournaalpostAfspraak g={g} />,
			// createJournaalpostGrootboekrekening: () => <>createJournaalpostGrootboekrekening</>,
			// updateJournaalpostGrootboekrekening: () => <>updateJournaalpostGrootboekrekening</>,
			deleteJournaalpostAfspraak: () => <DeleteJournaalpostAfspraak g={g} />,
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
			`${e.entityType} (${e.entityId})`
		]), [] as string[])
	];
	return (
		<Box>
			<Text fontSize={"1rem"}>{t("auditLog.unknown")}</Text>
			<Text>{context.join(", ")}</Text>
		</Box>
	);
};

export default AuditLogText;