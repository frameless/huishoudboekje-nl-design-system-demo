import {ApolloProvider} from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import apolloClient from "./lib/apolloClient";

ReactDOM.render(
	<React.StrictMode>
		<ApolloProvider client={apolloClient}>
			<App />
		</ApolloProvider>
	</React.StrictMode>,
	document.getElementById("root"),
);