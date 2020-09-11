import React from "react";
import ApiStatus from "./components/ApiStatus";
import { useTranslate } from "./config/i18n";
import { Box, Flex, Stack, Text } from "@chakra-ui/core";
import User from "./components/User";
import Logo from "./components/Logo";

const App = () => {
	const { t } = useTranslate();

	return (
		<Flex h={"auto"} minHeight={"100vh"} w={"100%"} justifyContent={"center"} alignItems={"center"}>
			<Stack spacing={10} minHeight={500} alignItems={"center"}>
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
		</Flex>
	);
};

export default App;
