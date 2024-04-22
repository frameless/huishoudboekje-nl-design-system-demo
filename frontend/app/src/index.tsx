import {ApolloProvider} from "@apollo/client";
import {ChakraProvider} from "@chakra-ui/react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import nl from "date-fns/locale/nl";
import dayjs from "dayjs";
import React from "react";
import {registerLocale, setDefaultLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css";
import {createRoot} from "react-dom/client";
import {BrowserRouter as Router} from "react-router-dom";
import App from "./App";
import "./config/i18n";
import theme from "./config/theme";
import "./global.scss";
import apolloClient from "./services/graphql-client";
import {useNotifications} from "./components/Notificaties";



dayjs.locale("nl-nl");
registerLocale("nl", nl);
setDefaultLocale("nl");

const container = document.getElementById("root");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
const queryClient = new QueryClient();

root.render(
	<React.StrictMode>
		<Router>
			<ApolloProvider client={apolloClient}>
				<QueryClientProvider client={queryClient}>
					<ChakraProvider theme={theme}>
						<App />
					</ChakraProvider>
				</QueryClientProvider>
			</ApolloProvider>
		</Router>
	</React.StrictMode>,
);
