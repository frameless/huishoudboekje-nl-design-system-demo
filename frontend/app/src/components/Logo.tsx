import React from 'react';
import {Box, Image} from "@chakra-ui/core";
import branding from "../branding";

const Logo = (props) => (
	<Box h={"auto"} bg={"white"} p={5} {...props}>
		<Image src={branding.logo} alt="logo"/>
	</Box>
);

export default Logo;