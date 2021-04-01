import React from "react";
import {Route, Switch, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import BetaalinstructiePage from "./Betaalinstructie";
import CreateAfspraak from "./CreateAfspraak";
import EditAfspraak from "./EditAfspraak";
import ViewAfspraak from "./ViewAfspraak";

const AfspraakRouter = () => {
	const {burgerId} = useParams<{burgerId: string}>();

	return (
		<Switch>
			<Route path={Routes.AfspraakBetaalinstructie()} component={BetaalinstructiePage} />
			<Route path={Routes.CreateBurgerAfspraken(parseInt(burgerId))} render={(props) => <CreateAfspraak burgerId={parseInt(burgerId)} {...props} />} />
			<Route path={Routes.EditAfspraak()} component={EditAfspraak} />
			<Route path={Routes.ViewAfspraak()} component={ViewAfspraak} />
		</Switch>
	);
};

export default AfspraakRouter;