import {isDev} from "../utils/things";

export enum Names {
	login = "inloggen",
	dashboard = "dashboard",
	burgers = "burgers",
	balances = "huishoudboekjes",
	organizations = "organisaties",
	banking = "bank",
	settings = "instellingen",
	notFound = "404"
}

const Routes = {
	Home: "/",
	Login: `/${Names.login}`,
	Burgers: `/${Names.burgers}`,
	Burger: (id: number) => `/${Names.burgers}/${id}`,
	CreateBurger: `/${Names.burgers}/toevoegen`,
	Organizations: `/${Names.organizations}`,
	Organization: (organizationId: number) => `/${Names.organizations}/${organizationId}`,
	CreateOrganization: `/${Names.organizations}/toevoegen`,

	Dashboard: `/${Names.dashboard}`,
	Balances: `/${Names.balances}`,
	Banking: `/${Names.banking}`,
	Settings: `/${Names.settings}`,
	NotFound: `/${Names.notFound}`,

	...(isDev && {GraphiQL: "/api/graphql"})
};

export default Routes;