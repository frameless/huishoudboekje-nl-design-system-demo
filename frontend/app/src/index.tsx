import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "./config/i18n";
import { ColorModeProvider, CSSReset, ThemeProvider } from "@chakra-ui/core";
import customTheme from "./config/customTheme";

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={customTheme}>
			<CSSReset/>
			<ColorModeProvider>
				<App/>
			</ColorModeProvider>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById("root"),
);
