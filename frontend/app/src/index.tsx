import {ApolloProvider} from "@apollo/client";
import {CSSReset, ThemeProvider} from "@chakra-ui/core";
import moment from "moment";
import "moment/locale/nl";
import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router} from "react-router-dom";
import App from "./App";
import "./config/i18n";
import theme from "./config/theme";
import apolloClient from "./services/graphql/client";

moment.locale("nl");

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CSSReset />

			<Router>
				<ApolloProvider client={apolloClient}>
					<App />
				</ApolloProvider>
			</Router>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById("root"),
);