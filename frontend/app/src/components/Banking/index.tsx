import React from "react";
import {useTranslation} from "react-i18next";
import {Route, Switch} from "react-router-dom";
import Routes from "../../config/routes";
import Page from "../Layouts/Page";
import BookingsExport from "./Bookings/BookingsExport";
import CustomerStatementMessages from "./CustomerStatementMessages";
import Transactions from "./Transactions";

const Banking = () => {
	const {t} = useTranslation();

	return (
		<Page title={t("banking.banking")}>
			<Switch>
				<Route path={Routes.Transactions} component={Transactions} />
				<Route path={Routes.CSMs} component={CustomerStatementMessages} />
				<Route path={Routes.BookingsExport} component={BookingsExport} />
			</Switch>
		</Page>
	);
};

export default Banking;