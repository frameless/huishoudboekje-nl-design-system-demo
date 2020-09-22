const Routes = {
	Home: "/",
	Login: "/login",
	Dashboard: "/dashboard",
	Citizens: "/citizens",
	Citizen: (citizenId: number) => "/citizens/" + citizenId,
	Settings: "/settings"
};

export default Routes;