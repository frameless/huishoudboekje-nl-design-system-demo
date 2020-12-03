import React from "react";
import {Route, Switch} from "react-router-dom";
import Routes, {RouteNames} from "../../config/routes";
import OrganisatieList from "./OrganisatieList";
import CreateOrganisatie from "./CreateOrganisatie";
import OrganisatieEdit from "./OrganisatieEdit";
import OrganisatieDetail from "./OrganisatieDetail";

const Organisaties = () => (
	<Switch>
		<Route exact path={Routes.Organisaties} component={OrganisatieList} />
		<Route path={Routes.Organisatie() + "/" + RouteNames.edit} component={OrganisatieEdit} />
		<Route path={Routes.CreateOrganisatie} exact component={CreateOrganisatie} />
		<Route path={Routes.Organisatie()} component={OrganisatieDetail} />
	</Switch>
);

export default Organisaties;