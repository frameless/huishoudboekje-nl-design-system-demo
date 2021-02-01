import {Box, Image} from "@chakra-ui/react";
import React from "react";
import {useHistory} from "react-router-dom";
import Routes from "../config/routes";

const Logo = (props) => {
	const history = useHistory();

	const onClick = () => {
		history.push(Routes.Home);
	};

	return (
		<Box h={"auto"} p={5} {...props} onClick={onClick} cursor={"pointer"}>
			<Image src={process.env.PUBLIC_URL + "/theme/logo.svg"} alt="logo" />
		</Box>
	);
};

export default Logo;