import {Flex, Image} from "@chakra-ui/react";
import React from "react";
import {NavLink} from "react-router-dom";
import {AppRoutes} from "../../config/routes";

const Logo: React.FC = () => (
	<Flex d={"block"} p={5} cursor={"pointer"} w={"100%"} as={NavLink} to={AppRoutes.Home}>
		<Image src={process.env.PUBLIC_URL + "/theme/logo.svg"} alt={"logo"} />
	</Flex>
);

export default Logo;