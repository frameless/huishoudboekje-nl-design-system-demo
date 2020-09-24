const Routes = {
	Home: "/",
	Login: "/login",
	Dashboard: "/dashboard",
	Citizens: "/citizens",
	Citizen: (citizenId: number) => "/citizens/" + citizenId,
	CitizenNew: "/citizens/new",
	Balances: "/balances",
	Organizations: "/organizations",
	Banking: "/banking",
	Settings: "/settings",
};

export default Routes;