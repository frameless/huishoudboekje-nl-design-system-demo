import {Box, Image} from "@chakra-ui/react";
import React from "react";
import {NavLink} from "react-router-dom";
import Routes from "../config/routes";

const Logo = (props) => (
	<Box d={"block"} p={5} cursor={"pointer"} as={NavLink} to={Routes.Home} {...props}>
		<Image src={process.env.PUBLIC_URL + "/theme/logo.svg"} alt="logo" />
	</Box>
);

export default Logo;