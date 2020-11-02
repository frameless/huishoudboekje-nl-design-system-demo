import { isDev } from "../utils/things";

export enum Names {
	login = "inloggen",
	dashboard = "dashboard",
	burgers = "burgers",
	balances = "huishoudboekjes",
	agreements = "afspraken",
	organizations = "organisaties",
	banking = "bank",
	settings = "instellingen",
	notFound = "404",
}

export enum Subpage {
	edit = "bewerken",
}

const Routes = {
	Home: "/",
	Login: `/${Names.login}`,
	Burgers: `/${Names.burgers}`,
	Burger: (id?: number, subpage?: Subpage) => `/${Names.burgers}${id ? `/${id}`: ""}${subpage ? `/${subpage}`:""}`,
	BurgerNew: `/${Names.burgers}/toevoegen`,
	AgreementNew: (burgerId: number) => `/${Names.burgers}/${burgerId}/${Names.agreements}/toevoegen`,
	Dashboard: `/${Names.dashboard}`,
	Agreements: `/${Names.burgers}/:burgerId(\\d+)/${Names.agreements}`,
	Balances: `/${Names.balances}`,
	Organizations: `/${Names.organizations}`,
	Organization: (organizationId: number) => `/${Names.organizations}/${organizationId}`,
	CreateOrganization: `/${Names.organizations}/toevoegen`,
	OrganizationNew: `/${Names.organizations}/toevoegen`,
	Banking: `/${Names.banking}`,
	Settings: `/${Names.settings}`,
	NotFound: `/${Names.notFound}`,

	...(isDev && { GraphiQL: "/api/graphql" }),
};

export default Routes;