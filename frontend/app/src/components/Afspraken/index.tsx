import React from "react";
import {Route, Switch} from "react-router-dom";
import Routes from "../../config/routes";
import AfspraakDetail from "./AfspraakDetail/AfspraakDetail";
import EditAfspraak from "./EditAfspraak";

const Afspraken = () => {
	return (
		<Switch>
			<Route path={Routes.ViewAfspraak()} component={AfspraakDetail} />
			<Route path={Routes.EditAfspraak()} component={EditAfspraak} />
		</Switch>
	);
};

export default Afspraken;