import {ApolloProvider} from "@apollo/client";
import {ChakraProvider} from "@chakra-ui/react";
import nl from "date-fns/locale/nl";
import dayjs from "dayjs";
import React from "react";
import {registerLocale, setDefaultLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css";
import ReactDOM from "react-dom";
import {BrowserRouter as Router} from "react-router-dom";
import App from "./App";
import theme from "./config/theme";
import apolloClient from "./services/graphql-client";
import {FeatureProvider} from "./utils/features";
import "./config/i18n";
import "./global.scss";

dayjs.locale("nl-nl");
registerLocale("nl", nl);
setDefaultLocale("nl");

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<ApolloProvider client={apolloClient}>
				<ChakraProvider theme={theme}>
					<FeatureProvider>
						<App />
					</FeatureProvider>
				</ChakraProvider>
			</ApolloProvider>
		</Router>
	</React.StrictMode>,
	document.getElementById("root"),
);