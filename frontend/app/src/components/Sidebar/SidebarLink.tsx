import {Button, ButtonProps, Flex, Text, useTheme} from "@chakra-ui/react";
import React, {useContext} from "react";
import {IconContext} from "react-icons";
import {NavLink} from "react-router-dom";
import {DrawerContext} from "../../utils/things";
import LinkIcon from "./LinkIcon";

type SidebarLinkProps = ButtonProps & {
	icon?,
	to: string,
	isActive?: boolean,
	target?: string
};

const SidebarLink: React.FC<SidebarLinkProps> = ({icon, to, isActive = false, children, ...props}) => {
	const drawerContext = useContext(DrawerContext);
	const theme = useTheme();

	const linkColor = isActive ? theme.colors.white : theme.colors.gray[500];
	const iconColor = isActive ? theme.colors.white : theme.colors.gray[400];

	return (
		<IconContext.Provider value={{color: "blue"}}>
			<Button as={NavLink} justifyContent={"flex-start"} to={to} onClick={() => drawerContext.onClose()} variant={isActive ? "solid" : "ghost"} colorScheme={isActive ? "primary" : "gray"}
				color={isActive ? "white" : "primary"} width={"100%"} _focus={{outline: "none", boxShadow: "none"}} {...props}>
				<Flex alignItems={"center"} width={"100%"} color={linkColor}>
					{icon && <LinkIcon mr={5} fontSize={"24px"} color={iconColor}>{icon()}</LinkIcon>}
					{typeof children === "string" ? <Text>{children}</Text> : children}
				</Flex>
			</Button>
		</IconContext.Provider>
	);
};

export default SidebarLink;
