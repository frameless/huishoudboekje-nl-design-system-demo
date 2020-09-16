import React from "react";
import {Box, Flex, Stack} from "@chakra-ui/core";
import Logo from "./Logo";
import User from "./User";
import {useIsMobile} from "react-grapple";
import {useSession} from "../utils/hooks";
import {Redirect} from "react-router-dom";

const LoginPage = () => {
	const session = useSession();
	const isMobile = useIsMobile();

	if (session.user) {
		return <Redirect to={"/"} />;
	}

	return (
		<Flex h={"auto"} minHeight={"100vh"} minWidth={"100%"} w={"auto"} bg={isMobile ? "white" : "gray.100"}>
			<Stack width={"100%"} direction={isMobile ? "column" : "row"} justifyContent={"center"} alignItems={"center"} spacing={30}>
				<Stack bg={"grey.800"} height={isMobile ? "auto" : "100%"} alignItems={"flex-end"} justifyContent={"center"} width={isMobile ? "100%" : "50%"} p={5}>
					<Logo width={"100%"} maxWidth={isMobile ? "100%" : 500} />
				</Stack>
				<Stack bg={"white"} height={isMobile ? "auto" : "100%"} justifyContent={"center"} width={isMobile ? "100%" : "50%"} p={5}>
					<Box maxWidth={300} alignSelf={isMobile ? "center" : "flex-start"}>
						<User />
					</Box>
				</Stack>
			</Stack>
		</Flex>
	);
};

export default LoginPage;