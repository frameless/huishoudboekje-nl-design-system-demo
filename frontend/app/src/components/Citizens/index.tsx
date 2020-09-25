import React from "react";
import {Route} from "react-router-dom";
import Routes from "../../config/routes";
import CitizenList from "./CitizenList";
import CitizenDetail from "./CitizenDetail";
import CreateCitizen from "./CreateCitizen";

const Citizens = () => (<>
	<Route exact path={Routes.Citizens} component={CitizenList} />
	<Route path={Routes.Citizens + "/:id(\\d+)"} component={CitizenDetail} />
	<Route path={Routes.CitizenNew} exact component={CreateCitizen} />
</>);

export default Citizens;