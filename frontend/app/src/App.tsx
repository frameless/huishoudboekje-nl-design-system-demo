import React from "react";
import { Box, Flex, Stack } from "@chakra-ui/core";
import User from "./components/User";
import Logo from "./components/Logo";

const App = () => {
	return (
		<Flex h={"auto"} minHeight={"100vh"} w={"100%"} justifyContent={"center"} alignItems={"center"}>
			<Stack spacing={10} minHeight={500} alignItems={"center"}>
				<Logo w={600}/>
				<Box>
					<User/>
				</Box>
			</Stack>
		</Flex>
	);
};

export default App;
