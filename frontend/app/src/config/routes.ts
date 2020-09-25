export enum Names {
	login = "inloggen",
	dashboard = "dashboard",
	citizens = "burgers",
	balances = "huishoudboekjes",
	organizations = "organisaties",
	banking = "bank",
	settings = "instellingen"
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
	Banking: `/${Names.banking}`,
	Settings: `/${Names.settings}`,
};

export default Routes;