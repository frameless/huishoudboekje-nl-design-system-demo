import React, {useContext} from "react";
import {Box, BoxProps, Button, Flex, Text} from "@chakra-ui/core";
import {useHistory, useLocation} from "react-router-dom";
import {IconContext} from "react-icons";
import theme from "../../config/theme";
import {DrawerContext} from "../../utils/things";

const SidebarLink = ({icon, href, children, exactMatch = false, ...props}) => {
	const {push} = useHistory();
	const location = useLocation();
	const isActive = exactMatch ? location.pathname === href : location.pathname.includes(href);
	const drawerContext = useContext(DrawerContext);

	// We use the mapped color from the Chakra theme because IconContext requires "regular" colors and thus can't handle "primary.700".
	// Todo: maybe create a hook that handles translation of colors.
	const linkColor = isActive ? theme.colors["primary"][700] : theme.colors["gray"][500];
	const iconColor = isActive ? theme.colors["primary"][700] : theme.colors["gray"][400];

	const LinkIcon: React.FC<BoxProps> = (props) => {
		return (
			<IconContext.Provider value={{style: {color: iconColor}}}>
				<Box {...props}>
					{icon()}
				</Box>
			</IconContext.Provider>
		)
	}

	return (
		<IconContext.Provider value={{color: "blue"}}>
			<Button justifyContent={"flex-start"} onClick={() => {
				drawerContext.onClose();
				push(href);
			}} variant={"link"} {...props}>
				<Flex alignItems={"center"}>
					<LinkIcon mr={5} fontSize={"24px"} />
					<Text color={linkColor}>{children}</Text>
				</Flex>
			</Button>
		</IconContext.Provider>
	);
};

export default SidebarLink;