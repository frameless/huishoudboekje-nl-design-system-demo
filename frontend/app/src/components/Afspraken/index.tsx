import React from "react";
import {Route, Switch} from "react-router-dom";
import Routes from "../../config/routes";
import AfspraakDetail from "./AfspraakDetail/AfspraakDetail";

const Afspraken = () => {
	return (
		<Switch>
			<Route path={Routes.ViewAfspraak()} component={AfspraakDetail} />
		</Switch>
	);
};

export default Afspraken;