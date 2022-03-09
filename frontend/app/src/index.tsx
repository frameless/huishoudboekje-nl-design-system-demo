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
import "./config/i18n";
import theme from "./config/theme";
import "./global.scss";
import apolloClient from "./services/graphql-client";
import StoreProvider from "./store";

dayjs.locale("nl-nl");
registerLocale("nl", nl);
setDefaultLocale("nl");

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<ApolloProvider client={apolloClient}>
				<ChakraProvider theme={theme}>
					<StoreProvider>
						<App />
					</StoreProvider>
				</ChakraProvider>
			</ApolloProvider>
		</Router>
	</React.StrictMode>,
	document.getElementById("root"),
);
export {createQueryParamsFromFilters} from "./utils/things";