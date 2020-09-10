import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./config/i18n";
import {CSSReset, ThemeProvider} from "@chakra-ui/core";
import theme from "./config/theme";

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CSSReset/>
			<App/>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById("root"),
);
