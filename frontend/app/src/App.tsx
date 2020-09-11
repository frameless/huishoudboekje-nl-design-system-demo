import React from "react";
import ApiStatus from "./components/ApiStatus";
import {useTranslate} from "./config/i18n";
import {Box, Stack, Text} from "@chakra-ui/core";
import User from "./components/User";
import Logo from "./components/Logo";

const App = () => {
	const {t} = useTranslate();

	return (
		<Box h={"100vh"} w={"100%"} id={"box"}>
			<Stack height={"100%"} spacing={10} display={"flex"} justifyContent={"center"} alignItems={"center"}>
				<Logo w={600}/>
				<Box>
					<User/>
				</Box>

				<Text>
					{t("home.running-in-mode", {
						mode: process.env.NODE_ENV,
					})}
				</Text>

				<ApiStatus/>
			</Stack>
		</Box>
	);
};

export default App;
