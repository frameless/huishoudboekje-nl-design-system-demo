import React from "react";
import {Route, Switch} from "react-router-dom";
import Routes from "../../config/routes";
import OrganizationList from "./OrganizationList";
import CreateOrganization from "./CreateOrganization";
import OrganizationDetail from "./OrganizationDetail";

const Organizations = () => (<Switch>
	<Route exact path={Routes.Organizations} component={OrganizationList} />
	<Route path={Routes.Organizations + "/:id(\\d+)"} component={OrganizationDetail} />
	<Route path={Routes.CreateOrganization} exact component={CreateOrganization} />
</Switch>);

export default Organizations;