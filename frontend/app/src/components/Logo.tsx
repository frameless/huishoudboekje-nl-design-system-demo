import React from "react";
import { Box, Image } from "@chakra-ui/core";

const Logo = (props) => (
	<Box h={"auto"} bg={"white"} p={5} {...props}>
		<Image src={process.env.PUBLIC_URL + "/theme/logo.svg"} alt="logo"/>
	</Box>
);

export default Logo;