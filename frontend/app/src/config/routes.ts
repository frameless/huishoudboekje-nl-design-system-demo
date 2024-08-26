import {generatePath} from "react-router";

export enum RouteNames {
	login = "inloggen",
	huishoudens = "huishoudens",
	burgers = "burgers",
	personal = "persoonlijk",
	afspraken = "afspraken",
	organisaties = "organisaties",
	afdelingen = "afdelingen",
	bankzaken = "bankzaken",
	transacties = "transacties",
	bankafschriften = "bankafschriften",
	betaalinstructies = "betaalinstructies",
	signalen = "signalen",
	rapportage = "rapportage",
	gebeurtenissen = "gebeurtenissen",
	configuratie = "configuratie",
	export = "export",
	exports = "exports",
	status = "status",
	notFound = "404",
	brievenExport = "brievenexport",
	overzicht = "overzicht",

	// Subroutes
	view = "bekijken",
	add = "toevoegen",
	edit = "wijzigen",
	followUp = "vervolg",
	copy = "kopie",
	betaalinstructie = "betaalinstructie",
}

const AppRoutesNew = {
	signalen: `/${RouteNames.signalen}`,
	huishoudens: `/${RouteNames.huishoudens}`,
	overzicht: `/${RouteNames.huishoudens}/${RouteNames.overzicht}`,
	huishouden: `/${RouteNames.huishoudens}/:id`,
	burgers: `/${RouteNames.burgers}`,
	burgersAction: `/${RouteNames.burgers}/:action`,
	burgerView: `/${RouteNames.burgers}/:id`,
	burgerAction: `/${RouteNames.burgers}/:id/:action`,
	burgerSubentityIdAction: `/${RouteNames.burgers}/:id/:entity/:action`,
	afspraakView: `/${RouteNames.afspraken}/:id`,
	afspraakAction: `/${RouteNames.afspraken}/:id/:action`,
	organisaties: `/${RouteNames.organisaties}`,
	organisatiesAction: `/${RouteNames.organisaties}/:action`,
	organisatieView: `/${RouteNames.organisaties}/:id`,
	organisatieAction: `/${RouteNames.organisaties}/:id/:action`,
	organisatieSubentityIdAction: `/${RouteNames.organisaties}/:id/:entity/:action`,
	bankzaken: `/${RouteNames.bankzaken}`,
	transacties: `/${RouteNames.bankzaken}/${RouteNames.transacties}`,
	transactiesView: `/${RouteNames.bankzaken}/${RouteNames.transacties}/:id`,
	bankafschriften: `/${RouteNames.bankzaken}/${RouteNames.bankafschriften}`,
	betaalinstructies: `/${RouteNames.bankzaken}/${RouteNames.betaalinstructies}`,
	betaalinstructiesAction: `/${RouteNames.bankzaken}/${RouteNames.betaalinstructies}/:action`,
	betaalinstructiesExport: `/${RouteNames.bankzaken}/${RouteNames.betaalinstructies}/${RouteNames.export}`,
	paymentExportView: `/${RouteNames.bankzaken}/${RouteNames.betaalinstructies}/${RouteNames.exports}/:id`,
	configuratie: `/${RouteNames.configuratie}`,
	rapportage: `/${RouteNames.rapportage}`,
	rapportageBurger: `/${RouteNames.rapportage}`,
	gebeurtenissen: `/${RouteNames.gebeurtenissen}`,
	status: `/${RouteNames.status}`,
	notFound: `/${RouteNames.notFound}`,
	export: `/api/${RouteNames.export}/:id`,
	brievenExport: `/api/${RouteNames.brievenExport}/:id/:format`,
};

export const AppRoutes = {
	Home: generatePath("/"),
	Signalen: generatePath(AppRoutesNew.signalen),
	Huishoudens: () => generatePath(AppRoutesNew.huishoudens),
	Huishouden: (id: string) => generatePath(AppRoutesNew.huishouden, {id}),
	Burgers: () => generatePath(AppRoutesNew.burgers),
	ViewBurger: (id: string) => generatePath(AppRoutesNew.burgerView, {id}),
	ViewBurgerPersonalDetails: (id: string) => generatePath(AppRoutesNew.burgerAction, {
		id,
		action: RouteNames.personal,
	}),
	ViewBurgerAuditLog: (id: string) => generatePath(AppRoutesNew.burgerAction, {
		id,
		action: RouteNames.gebeurtenissen,
	}),
	CreateBurger: () => generatePath(AppRoutesNew.burgersAction, {
		action: RouteNames.add,
	}),
	EditBurger: (id: string) => generatePath(AppRoutesNew.burgerAction, {
		id,
		action: RouteNames.edit,
	}),
	CreateBurgerAfspraak: (burgerId: string) => generatePath(AppRoutesNew.burgerSubentityIdAction, {
		id: burgerId,
		entity: RouteNames.afspraken,
		action: RouteNames.add,
	}),
	ViewAfspraak: (id: string) => generatePath(AppRoutesNew.afspraakView, {id}),
	EditAfspraak: (id: string) => generatePath(AppRoutesNew.afspraakAction, {
		id,
		action: RouteNames.edit,
	}),
	FollowUpAfspraak: (id: string) => generatePath(AppRoutesNew.afspraakAction, {
		id,
		action: RouteNames.followUp,
	}),
	CopyAfspraak: (id: string) => generatePath(AppRoutesNew.afspraakAction, {
		id,
		action: RouteNames.copy,
	}),
	AfspraakBetaalinstructie: (id: string) => generatePath(AppRoutesNew.afspraakAction, {
		id,
		action: RouteNames.betaalinstructie,
	}),
	Organisaties: generatePath(AppRoutesNew.organisaties),
	Organisatie: (id: string) => generatePath(AppRoutesNew.organisatieView, {id}),
	CreateOrganisatie: generatePath(AppRoutesNew.organisatiesAction, {
		action: RouteNames.add,
	}),
	EditOrganisatie: (id: string) => generatePath(AppRoutesNew.organisatieAction, {
		id,
		action: RouteNames.edit,
	}),
	Afdeling: (organisatieId: string, afdelingId: string) => generatePath(AppRoutesNew.organisatieSubentityIdAction, {
		id: organisatieId,
		entity: RouteNames.afdelingen,
		action: afdelingId,
	}),
	Bankzaken: generatePath(AppRoutesNew.bankzaken),
	Transacties: generatePath(AppRoutesNew.transacties),
	ViewTransactie: (transactieId: string) => generatePath(AppRoutesNew.transactiesView, {
		id: transactieId,
	}),
	Bankafschriften: generatePath(AppRoutesNew.bankafschriften),
	Betaalinstructies: generatePath(AppRoutesNew.betaalinstructies),
	CreateBetaalinstructies: () => generatePath(AppRoutesNew.betaalinstructiesAction, {
		action: RouteNames.add
	}),
	ViewPaymentExport: (paymentExportId: string) => generatePath(AppRoutesNew.paymentExportView, {
		id: paymentExportId
	}),
	Configuratie: generatePath(AppRoutesNew.configuratie),
	Rapportage: generatePath(AppRoutesNew.rapportage),
	RapportageBurger: (burgerIds: string[]) => {
		const url = generatePath(AppRoutesNew.rapportageBurger)
		const params = new URLSearchParams({
			burgerId: burgerIds.join(",")
		}).toString()
		return url + "?" + params
	}
	,
	Gebeurtenissen: generatePath(AppRoutesNew.gebeurtenissen),
	Status: generatePath(AppRoutesNew.status),
	NotFound: generatePath(AppRoutesNew.notFound),
	Export: (id) => generatePath(AppRoutesNew.export, {id}),
	BrievenExport: (burgerId: string, format: "excel" | "csv") => generatePath(AppRoutesNew.brievenExport, {
		id: burgerId,
		format,
	}),
	Overzicht: (burgerIds: string[]) => {
		const url = generatePath(AppRoutesNew.overzicht)
		const params = new URLSearchParams({
			burgerId: burgerIds.join(",")
		}).toString()
		return url + "?" + params
	}
};
