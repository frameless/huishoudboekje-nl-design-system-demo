import React from "react";
import {Route, Switch} from "react-router-dom";
import Routes, {RouteNames} from "../../config/routes";
import OrganizationList from "./OrganizationList";
import CreateOrganization from "./CreateOrganization";
import OrganizationEdit from "./OrganizationEdit";
import OrganizationDetail from "./OrganizationDetail";

const Organizations = () => (
	<Switch>
		<Route exact path={Routes.Organizations} component={OrganizationList} />
		<Route path={Routes.Organization() + "/" + RouteNames.edit} component={OrganizationEdit} />
		<Route path={Routes.CreateOrganization} exact component={CreateOrganization} />
		<Route path={Routes.Organization()} component={OrganizationDetail} />
	</Switch>
);

export default Organizations;