import React from "react";
import {Route} from "react-router-dom";
import Routes from "../../config/routes";
import CitizenList from "./CitizenList";
import CitizenDetail from "./CitizenDetail";

const Citizens = () => {
	return <>
		<Route exact path={Routes.Citizens} component={CitizenList} />
		<Route path={Routes.Citizens + "/:id"} component={CitizenDetail} />
	</>
};

export default Citizens;