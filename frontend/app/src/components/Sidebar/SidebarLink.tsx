import React from "react";
import {Button, Flex, Icon, Text} from "@chakra-ui/core";
import {useHistory} from "react-router-dom";

const SidebarLink = ({icon, href, children, ...props}) => {
	const {push} = useHistory();

	return (
		<Button justifyContent={"flex-start"} onClick={() => push(href)} {...props}>
			<Flex alignItems={"center"}>
				<Icon as={icon} size={"24px"} mr={6} />
				<Text>{children}</Text>
			</Flex>
		</Button>
	);
};

export default SidebarLink;