import React from "react";
import {Trans} from "react-i18next";

export const auditLogTexts = (values, components, action) => {
	const texts = {
		// Queries
		organisatie: () => <Trans i18nKey={"auditLog.viewOrganisatie"} values={values} components={components} />,
		organisaties: () => <Trans i18nKey={"auditLog.viewOrganisaties"} values={values} components={components} />,
		afspraak: () => {
			// This can not be shorthanded (values.AfspraakOrganisatie ? "auditLog.viewAfspraak" : "auditLog.afspraakBurger") because while testing the i18n then the translation key will not be found.
			if (!values.afspraakOrganisatie) {
				return (<Trans i18nKey={"auditLog.viewAfspraakBurger"} values={values} components={components} />);
			}
			return (<Trans i18nKey={"auditLog.viewAfspraak"} values={values} components={components} />);
		},
		afspraken: () => <Trans i18nKey={"auditLog.viewAfspraken"} values={values} components={components} />,
		rubrieken: () => <Trans i18nKey={"auditLog.viewRubrieken"} values={values} components={components} />,
		burger: () => <Trans i18nKey={"auditLog.viewBurger"} values={values} components={components} />,
		burgers: () => <Trans i18nKey={"auditLog.viewBurgers"} values={values} components={components} />,
		huishouden: () => <Trans i18nKey={"auditLog.viewHuishouden"} values={values} components={components} />,
		huishoudens: () => <Trans i18nKey={"auditLog.viewHuishoudens"} values={values} components={components} />,
		customerStatementMessages: () => <Trans i18nKey={"auditLog.viewCustomerStatementMessages"} values={values} components={components} />,
		bankTransaction: () => <Trans i18nKey={"auditLog.viewTransaction"} values={values} components={components} />,
		bankTransactions: () => <Trans i18nKey={"auditLog.viewTransactions"} values={values} components={components} />,
		bankTransactionsPaged: () => <Trans i18nKey={"auditLog.viewTransactions"} values={values} components={components} />,
		exports: () => <Trans i18nKey={"auditLog.viewExports"} values={values} components={components} />,
		exportBrieven: () => <Trans i18nKey={"auditLog.exportBrieven"} values={values} components={components} />,
		configuraties: () => <Trans i18nKey={"auditLog.viewConfiguraties"} values={values} components={components} />,
		rekening: () => <Trans i18nKey={"auditLog.viewRekening"} values={values} components={components} />,
		grootboekrekeningen: () => <Trans i18nKey={"auditLog.viewGrootboekrekeningen"} values={values} components={components} />,

		// Mutations
		createBurger: () => <Trans i18nKey={"auditLog.createBurger"} values={values} components={components} />,
		updateBurger: () => <Trans i18nKey={"auditLog.updateBurger"} values={values} components={components} />,
		deleteBurger: () => <Trans i18nKey={"auditLog.deleteBurger"} values={values} components={components} />,
		createAfspraak: () => <Trans i18nKey={"auditLog.createAfspraak"} values={values} components={components} />,
		updateAfspraak: () => <Trans i18nKey={"auditLog.updateAfspraak"} values={values} components={components} />,
		deleteAfspraak: () => <Trans i18nKey={"auditLog.deleteAfspraak"} values={values} components={components} />,
		updateRekening: () => <Trans i18nKey={"auditLog.updateRekening"} values={values} components={components} />,
		createOrganisatie: () => <Trans i18nKey={"auditLog.createOrganisatie"} values={values} components={components} />,
		updateOrganisatie: () => <Trans i18nKey={"auditLog.updateOrganisatie"} values={values} components={components} />,
		deleteOrganisatie: () => <Trans i18nKey={"auditLog.deleteOrganisatie"} values={values} components={components} />,
		createJournaalpostAfspraak: () => <Trans i18nKey={"auditLog.createJournaalpostAfspraak"} values={values} components={components} />,
		createJournaalpostPerAfspraak: () => <Trans i18nKey={"auditLog.createJournaalpostAfspraak"} values={values} components={components} />,
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
		createBurgerRekening: () => <Trans i18nKey={"auditLog.createBurgerRekening"} values={values} components={components} />,
		deleteBurgerRekening: () => <Trans i18nKey={"auditLog.deleteBurgerRekening"} values={values} components={components} />,
		addAfspraakZoekterm: () => <Trans i18nKey={"auditLog.addAfspraakZoekterm"} values={values} components={components} />,
		deleteAfspraakZoekterm: () => <Trans i18nKey={"auditLog.deleteAfspraakZoekterm"} values={values} components={components} />,
		startAutomatischBoeken: () => <Trans i18nKey={"auditLog.startAutomatischBoeken"} values={values} components={components} />,
		updateAfspraakBetaalinstructie: () => <Trans i18nKey={"auditLog.updateAfspraakBetaalinstructie"} values={values} components={components} />,
		createExportOverschrijvingen: () => <Trans i18nKey={"auditLog.createExportOverschrijvingen"} values={values} components={components} />,
		addHuishoudenBurger: () => <Trans i18nKey={"auditLog.addHuishoudenBurger"} values={values} components={components} />,
		deleteHuishoudenBurger: () => <Trans i18nKey={"auditLog.deleteHuishoudenBurger"} values={values} components={components} />,
		createHuishouden: () => <Trans i18nKey={"auditLog.createHuishouden"} values={values} components={components} />,
		createAfdelingRekening: () => <Trans i18nKey={"auditLog.createAfdelingRekening"} values={values} components={components} />,
		deleteAfdelingRekening: () => <Trans i18nKey={"auditLog.deleteAfdelingRekening"} values={values} components={components} />,
		createPostadres: () => <Trans i18nKey={"auditLog.createPostadres"} values={values} components={components} />,
		updatePostadres: () => <Trans i18nKey={"auditLog.updatePostadres"} values={values} components={components} />,
		deletePostadres: () => <Trans i18nKey={"auditLog.deletePostadres"} values={values} components={components} />,
		createAfdeling: () => <Trans i18nKey={"auditLog.createAfdeling"} values={values} components={components} />,
		updateAfdeling: () => <Trans i18nKey={"auditLog.updateAfdeling"} values={values} components={components} />,
		deleteAfdeling: () => <Trans i18nKey={"auditLog.deleteAfdeling"} values={values} components={components} />,
	};

	return texts[action];
};