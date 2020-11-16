import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./config/i18n";
import {CSSReset, ThemeProvider} from "@chakra-ui/core";
import theme from "./config/theme";
import {BrowserRouter as Router} from "react-router-dom";
import {ApolloProvider} from "@apollo/client";
import apolloClient from "./services/graphql/client";

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