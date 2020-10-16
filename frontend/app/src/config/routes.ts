import {isDev} from "../utils/things";

export enum Names {
	login = "inloggen",
	dashboard = "dashboard",
	citizens = "burgers",
	balances = "huishoudboekjes",
	organizations = "organisaties",
	banking = "bank",
	settings = "instellingen",
	notFound = "404"
}

const Routes = {
	Home: "/",
	Login: `/${Names.login}`,
	Dashboard: `/${Names.dashboard}`,
	Citizens: `/${Names.citizens}`,
	Citizen: (citizenId: number) => `/${Names.citizens}/${citizenId}`,
	CitizenNew: `/${Names.citizens}/toevoegen`,
	Balances: `/${Names.balances}`,
	Organizations: `/${Names.organizations}`,
	Organization: (organizationId: number) => `/${Names.organizations}/${organizationId}`,
	OrganizationNew: `/${Names.organizations}/toevoegen`,
	Banking: `/${Names.banking}`,
	Settings: `/${Names.settings}`,
	NotFound: `/${Names.notFound}`,

	...(isDev && {GraphiQL: "/api/graphql"})
};

export default Routes;