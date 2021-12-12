import React from "react";
import {Route, Switch} from "react-router-dom";
import Routes, {RouteNames} from "../../config/routes";
import PageNotFound from "../PageNotFound";
import CreateAfdeling from "./CreateAfdeling";
import CreateOrganisatie from "./CreateOrganisatie";
import EditOrganisatie from "./EditOrganisatie";
import OrganisatieDetail from "./OrganisatieDetail";
import OrganisatieList from "./OrganisatieList";

const Organisaties = () => (
	<Switch>
		<Route exact path={Routes.Organisaties}>
			<OrganisatieList />
		</Route>
		<Route path={`${Routes.Organisatie()}/${RouteNames.edit}`}>
			<EditOrganisatie />
		</Route>
		<Route exact path={Routes.CreateOrganisatie}>
			<CreateOrganisatie />
		</Route>
		<Route exact path={Routes.CreateAfdeling()}>
			<CreateAfdeling />
		</Route>
		<Route path={Routes.Organisatie()}>
			<OrganisatieDetail />
		</Route>
		<Route>
			<PageNotFound />
		</Route>
	</Switch>
);

export default Organisaties;