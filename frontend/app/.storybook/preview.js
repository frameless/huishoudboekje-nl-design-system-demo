import {addDecorator} from "@storybook/react";
import "./theme.js";
import theme from "../src/config/theme";
import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import {BrowserRouter as Router} from "react-router-dom";

addDecorator(story => (
	<ChakraProvider theme={extendTheme(theme)}>
		<Router>
			{story()}
		</Router>
	</ChakraProvider>
));

export const parameters = {
	actions: {argTypesRegex: "^on[A-Z].*"},
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};