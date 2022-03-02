import "./theme.js";
import theme from "../src/config/theme";
import {ChakraProvider} from "@chakra-ui/react";
import {BrowserRouter as Router} from "react-router-dom";
import i18n from "../src/config/i18n";
import "react-datepicker/dist/react-datepicker.min.css";
import "../src/global.scss";

export const decorators = [
	story => {
		return (
			<Router>
				<ChakraProvider theme={theme}>
					{story()}
				</ChakraProvider>
			</Router>
		);
	},
];

export const parameters = {
	i18n,
	locale: "nl_NL",
	locales: {
		nl_NL: {title: "Nederlands", right: "NL"},
	},
	actions: {
		argTypesRegex: "^on[A-Z].*",
	},
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	chakra: {
		theme,
	},
};