import React from "react";
import {NavLink} from "react-router-dom";
import {HStack} from "@chakra-ui/react";

const Navigation = () => {
	return (
		<header className={"showcase"}>
			<nav>
				<HStack>
					<NavLink to={"/"}>Home</NavLink>
					<NavLink to={"/toekomst"}>Toekomst</NavLink>
				</HStack>
			</nav>
		</header>
	);
};

export default Navigation;