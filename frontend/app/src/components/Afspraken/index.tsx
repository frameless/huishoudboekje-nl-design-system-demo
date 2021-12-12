import React from "react";
import {Route, Switch, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import BetaalinstructiePage from "./Betaalinstructie";
import CreateAfspraak from "./CreateAfspraak";
import EditAfspraak from "./EditAfspraak";
import FollowUpAfspraak from "./FollowUpAfspraak";
import ViewAfspraak from "./ViewAfspraak";

const AfspraakRouter = () => {
	const {burgerId} = useParams<{burgerId: string}>();

	return (
		<Switch>
			<Route path={Routes.AfspraakBetaalinstructie()}>
				<BetaalinstructiePage />
			</Route>
			<Route path={Routes.CreateBurgerAfspraken(parseInt(burgerId))}>
				<CreateAfspraak burgerId={parseInt(burgerId)} />
			</Route>
			<Route path={Routes.EditAfspraak()}>
				<EditAfspraak />
			</Route>
			<Route path={Routes.ViewAfspraak()}>
				<ViewAfspraak />
			</Route>
			<Route path={Routes.FollowUpAfspraak()}>
				<FollowUpAfspraak />
			</Route>
		</Switch>
	);
};

export default AfspraakRouter;