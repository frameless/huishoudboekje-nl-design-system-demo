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
import LoadingPage from "./components/LoadingPage";
import StatusErrorPage from "./components/Status/StatusErrorPage";
import "./config/i18n";
import theme from "./config/theme";
import "./global.scss";
import apolloClient from "./services/graphql-client";
import {FeatureProvider} from "./utils/features";
import {ServicesProvider} from "./utils/Services";

dayjs.locale("nl-nl");
registerLocale("nl", nl);
setDefaultLocale("nl");

const featureFlags = [
	"auditlogmodals",
];

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<ApolloProvider client={apolloClient}>
				<ChakraProvider theme={theme}>
					<ServicesProvider loading={<LoadingPage />} fallback={<StatusErrorPage />}>
						<FeatureProvider flags={featureFlags}>
							<App />
						</FeatureProvider>
					</ServicesProvider>
				</ChakraProvider>
			</ApolloProvider>
		</Router>
	</React.StrictMode>,
	document.getElementById("root"),
);