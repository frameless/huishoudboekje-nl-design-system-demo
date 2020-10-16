import React from "react";
import {Route} from "react-router-dom";
import Routes from "../../config/routes";
import OrganizationList from "./OrganizationList";
import CreateOrganization from "./CreateOrganization";

const Organizations = () => (<>
	<Route exact path={Routes.Organizations} component={OrganizationList} />
	{/*<Route path={Routes.Organizations + "/:id(\\d+)"} component={BurgerDetail} />*/}
	<Route path={Routes.OrganizationNew} exact component={CreateOrganization} />
</>);

export default Organizations;