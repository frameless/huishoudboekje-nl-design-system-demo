import React from "react";
import {Stack} from "@chakra-ui/core";
import SidebarLink from "./SidebarLink";
import {GrBasket, GrDashboard, GrLink, GrSettingsOption, GrUser} from "react-icons/all";

const Sidebar = (props) => {
	return (
		<Stack spacing={10} p={5} alignSelf={"center"} {...props}>
			<Stack spacing={5}>
				<SidebarLink href={"/dashboard"} icon={GrDashboard}>Dashboard</SidebarLink>
				<SidebarLink href={"/"} icon={GrUser}>Deelnemers</SidebarLink>
				<SidebarLink href={"/"} icon={GrLink}>Ketenpartners</SidebarLink>
				<SidebarLink href={"/"} icon={GrBasket}>Bankzaken</SidebarLink>
				<SidebarLink href={"/settings"} icon={GrSettingsOption}>Instellingen</SidebarLink>
			</Stack>
		</Stack>
	);
};

export default Sidebar;