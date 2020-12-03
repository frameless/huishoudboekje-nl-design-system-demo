import {Heading, Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Route, Switch} from "react-router-dom";
import Routes from "../../config/routes";
import BookingsExport from "./Bookings/BookingsExport";
import CustomerStatementMessages from "./CustomerStatementMessages";
import Transactions from "./Transactions";

const Banking = () => {
	const {t} = useTranslation();

	return (
		<Stack spacing={5}>
			<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"} maxWidth={1200}>
				<Stack direction={"row"} spacing={5} alignItems={"center"}>
					<Heading size={"lg"}>{t("banking.banking")}</Heading>
				</Stack>
			</Stack>

			<Switch>
				<Route path={Routes.Transactions} component={Transactions} />
				<Route path={Routes.CSMs} component={CustomerStatementMessages} />
				<Route path={Routes.BookingsExport} component={BookingsExport} />
			</Switch>
		</Stack>
	);
};

export default Banking;