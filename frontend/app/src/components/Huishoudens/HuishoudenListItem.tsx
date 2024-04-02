import {Avatar, Badge, Box, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {NavLink} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {Burger, Huishouden} from "../../generated/graphql";
import {formatBurgerName} from "../../utils/things";
import GridCard from "../shared/GridCard";

const HuishoudenListItem: React.FC<{ huishouden: Huishouden }> = ({huishouden}) => {

	// const signalen = (huishouden.burgers || []).reduce((list, burger: Burger) => {
	// 	// const signalen = (burger.afspraken || [])
	// 	// 	.map(a => a.alarm)
	// 	// 	.map(a => a?.signaal)
	// 	// 	.filter(s => s?.isActive)
	// 	// 	.filter(s => s !== undefined);

	// 	list.push(...signalen as Signaal[]);
	// 	return list;
	// }, [] as Signaal[]);

	return (
		<GridCard justify={"flex-start"} position={"relative"} as={NavLink} to={AppRoutes.Huishouden(String(huishouden.id))}>
			{/* {signalen.length > 0 && (
				<Box position={"absolute"} top={1} right={1}>
					<Badge fontSize={"sm"} p={1} colorScheme={"secondary"}>
						{signalen.length > 99 ? "99+" : signalen.length}
					</Badge>
				</Box>
			)} */}
			<Stack direction={["row", "column"]} spacing={5}>
				{huishouden.burgers?.map(b => (
					<Stack id={"household_citizen_"+b.id} key={b.id} spacing={3} direction={"row"} align={"center"}>
						<Avatar size={"xs"} name={formatBurgerName(b)} />
						<Text fontSize={"md"}><strong>{formatBurgerName(b)}</strong></Text>
					</Stack>
				))}
			</Stack>
		</GridCard>
	);
};

export default HuishoudenListItem;