import {ApolloProvider} from "@apollo/client";
import {ChakraProvider} from "@chakra-ui/react";
import nl from "date-fns/locale/nl";
import moment from "moment";
import "moment-recur-ts";
import "moment/locale/nl";
import React from "react";
import {registerLocale, setDefaultLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css";
import ReactDOM from "react-dom";
import {BrowserRouter as Router} from "react-router-dom";
import App from "./App";
import "./config/i18n";
import theme from "./config/theme";
import apolloClient from "./services/graphql-client";

moment.locale("nl");
registerLocale("nl", nl);
setDefaultLocale("nl");

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<ApolloProvider client={apolloClient}>
				<ChakraProvider theme={theme}>
					<App />
				</ChakraProvider>
			</ApolloProvider>
		</Router>
	</React.StrictMode>,
	document.getElementById("root"),
);