import React from "react";
import {Route, Switch} from "react-router-dom";
import Routes, {RouteNames} from "../../config/routes";
import CreateOrganisatie from "./CreateOrganisatie";
import OrganisatieDetail from "./OrganisatieDetail";
import OrganisatieEdit from "./OrganisatieEdit";
import OrganisatieList from "./OrganisatieList";

const Organisaties = () => (
	<Switch>
		<Route exact path={Routes.Organisaties} component={OrganisatieList} />
		<Route path={Routes.Organisatie() + "/" + RouteNames.edit} component={OrganisatieEdit} />
		<Route path={Routes.CreateOrganisatie} exact component={CreateOrganisatie} />
		<Route path={Routes.Organisatie()} component={OrganisatieDetail} />
	</Switch>
);

export default Organisaties;