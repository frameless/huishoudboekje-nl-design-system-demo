import {Box, BoxProps, Button, ButtonProps, Flex, Text, useTheme} from "@chakra-ui/react";
import React, {useContext} from "react";
import {IconContext} from "react-icons";
import {NavLink, useLocation} from "react-router-dom";
import {DrawerContext} from "../../utils/things";

const SidebarLink: React.FC<ButtonProps & { icon?, to: string, exactMatch?: boolean, target?: string }> = ({icon, to, children, exactMatch = false, ...props}) => {
	const location = useLocation();
	const isActive = exactMatch ? location.pathname === to : location.pathname.includes(to);
	const drawerContext = useContext(DrawerContext);
	const theme = useTheme();

	const linkColor = isActive ? theme.colors.white : theme.colors.gray[500];
	const iconColor = isActive ? theme.colors.white : theme.colors.gray[400];

	const LinkIcon: React.FC<BoxProps> = (props) => (
		<IconContext.Provider value={{style: {color: iconColor}}}>
			<Box {...props}>
				{icon && icon()}
			</Box>
		</IconContext.Provider>
	);

	return (
		<IconContext.Provider value={{color: "blue"}}>
			<Button as={NavLink} justifyContent={"flex-start"} to={to} onClick={() => drawerContext.onClose()} variant={isActive ? "solid" : "ghost"} colorScheme={isActive ? "primary" : "gray"}
				color={isActive ? "white" : "primary"} width={"100%"} _focus={{outline: "none", boxShadow: "none"}} {...props}>
				<Flex alignItems={"center"} width={"100%"} color={linkColor}>
					{icon && <LinkIcon mr={5} fontSize={"24px"} />}
					{typeof children === "string" ? <Text>{children}</Text> : children}
				</Flex>
			</Button>
		</IconContext.Provider>
	);
};

export default SidebarLink;
