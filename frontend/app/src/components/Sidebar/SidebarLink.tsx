import {Box, BoxProps, Button, ButtonProps, Flex, Text, useTheme} from "@chakra-ui/react";
import React, {useContext} from "react";
import {IconContext} from "react-icons";
import {useHistory, useLocation} from "react-router-dom";
import {DrawerContext} from "../../utils/things";

const SidebarLink: React.FC<ButtonProps & { icon?, href: string, exactMatch?: boolean }> = ({icon, href, children, exactMatch = false, ...props}) => {
	const {push} = useHistory();
	const location = useLocation();
	const isActive = exactMatch ? location.pathname === href : location.pathname.includes(href);
	const drawerContext = useContext(DrawerContext);
	const theme = useTheme();

	const linkColor = isActive ? theme.colors["white"] : theme.colors.gray[500];
	const iconColor = isActive ? theme.colors["white"] : theme.colors.gray[400];

	const LinkIcon: React.FC<BoxProps> = (props) => (
		<IconContext.Provider value={{style: {color: iconColor}}}>
			<Box {...props}>
				{icon && icon()}
			</Box>
		</IconContext.Provider>
	);

	return (
		<IconContext.Provider value={{color: "blue"}}>
			<Button justifyContent={"flex-start"} onClick={() => {
				drawerContext.onClose();
				push(href);
			}} variant={isActive ? "solid" : "ghost"} colorScheme={isActive ? "primary" : "gray"} {...props} color={isActive ? "white" : "primary"} width="100%">
				<Flex alignItems={"center"}>
					{icon && <LinkIcon mr={5} fontSize={"24px"} />}
					<Text color={linkColor}>{children}</Text>
				</Flex>
			</Button>
		</IconContext.Provider>
	);
};

export default SidebarLink;