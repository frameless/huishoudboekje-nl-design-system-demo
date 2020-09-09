import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import ApiStatus from "./components/ApiStatus";
import { useTranslate } from "./config/i18n";
import { Trans } from "react-i18next";
import { Box, Button, Stack, Text, useColorMode } from "@chakra-ui/core";
import User from "./components/User";

const App = () => {
	const { t } = useTranslate();
	const { colorMode, toggleColorMode } = useColorMode();

	const styles = {
		light: {
			bg: "white",
			color: "#282c34",
		},
		dark: {
			bg: "#282c34",
			color: "white",
		},
	};

	return (
		<Box h={"100vh"} w={"100%"} id={"box"}>
			<Stack height={"100%"} spacing={5} display={"flex"} justifyContent={"center"} alignItems={"center"} {...styles[colorMode]}>
				<Box>
					<User />
				</Box>

				<img src={logo} className="App-logo" alt="logo"/>
				<Text>
					{t("home.running-in-mode", {
						mode: process.env.NODE_ENV,
					})}
				</Text>

				<Button onClick={() => toggleColorMode()}>
					Toggle to {colorMode === "light" ? "dark" : "light"} mode
				</Button>

				<p>
					<Trans i18nKey={"home.hello-intro"} components={[<a href={"/"}>Blaat</a>]}/>
				</p>

				<ApiStatus/>
			</Stack>
		</Box>
	);
};

export default App;
