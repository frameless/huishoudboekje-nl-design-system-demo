import {Stack, Text, TextProps} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {GebruikersActiviteit} from "../../generated/graphql";
import CreateAfspraak from "./AuditLogItems/CreateAfspraak";
import CreateGebruiker from "./AuditLogItems/CreateGebruiker";
import CreateJournaalpostAfspraak from "./AuditLogItems/CreateJournaalpostAfspraak";
import DeleteJournaalpostAfspraak from "./AuditLogItems/DeleteJournaalpostAfspraak";
import UpdateAfspraak from "./AuditLogItems/UpdateAfspraak";
import UpdateGebruiker from "./AuditLogItems/UpdateGebruiker";
import ViewAfspraak from "./AuditLogItems/ViewAfspraak";
import ViewGebruikers from "./AuditLogItems/ViewGebruikers";
import ViewGebruiker from "./AuditLogItems/ViewGebruiker";
import UpdateRekening from "./AuditLogItems/UpdateRekening";

const AuditLogText: React.FC<TextProps & { g: GebruikersActiviteit }> = ({g, ...props}) => {
	const {t} = useTranslation();
	const {action, entities = []} = g;

	if (action) {
		const auditLogTextConfig: Record<string, () => JSX.Element> = {
			afspraak: () => <ViewAfspraak g={g} />,
			gebruiker: () => <ViewGebruiker g={g} />,
			gebruikers: () => <ViewGebruikers g={g} />,
			createGebruiker: () => <CreateGebruiker g={g} />,
			updateGebruiker: () => <UpdateGebruiker g={g} />,
			// deleteGebruiker: () => <>deleteGebruiker</>,
			createAfspraak: () => <CreateAfspraak g={g} />,
			updateAfspraak: () => <UpdateAfspraak g={g} />,
			// deleteAfspraak: () => <>deleteAfspraak</>,
			updateRekening: () => <UpdateRekening g={g} />,
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
		<Stack spacing={1}>
			<Text>{t("auditLog.unknown")}</Text>
			<Text fontSize={"sm"}>{context.join(", ")}</Text>
		</Stack>
	);
};

export default AuditLogText