import React from "react";
import {Button, Flex, Icon, Text} from "@chakra-ui/core";
import {NavLink} from "react-router-dom";

const SidebarLink = ({icon, href, children, ...props}) => {
	return (
		<Button justifyContent={"flex-start"} {...props}>
			<NavLink to={href}>
				<Flex alignItems={"center"}>
					<Icon as={icon} size={"24px"} mr={6} />
					<Text>{children}</Text>
				</Flex>
			</NavLink>
		</Button>
	);
};

export default SidebarLink;