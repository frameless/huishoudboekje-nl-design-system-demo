import {Avatar, Badge, Box, Grid, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {NavLink} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Burger, Huishouden} from "../../../generated/graphql";
import {formatBurgerName} from "../../../utils/things";
import DashedAddButton from "../../shared/DashedAddButton";
import GridCard from "../../shared/GridCard";

const HuishoudenBurgerItem: React.FC<{burger: Burger}> = ({burger}) => {
	// const signalen = (burger.afspraken || [])
	// 	.map(a => a.alarm)
	// 	.map(a => a?.signaal)
	// 	.filter(s => s?.isActive)
	// 	.filter(s => s !== undefined);

	return (
		<GridCard as={NavLink} justify={["flex-start", "center"]} to={AppRoutes.ViewBurger(String(burger.id))} position={"relative"}>
			{/* {signalen.length > 0 && (
				<Box position={"absolute"} top={1} right={1}>
					<Badge fontSize={"sm"} p={1} colorScheme={"secondary"}>
						{signalen.length > 99 ? "99+" : signalen.length}
					</Badge>
				</Box>
			)} */}
			<Stack direction={["row", "column"]} spacing={5} align={"center"} justify={["flex-start", "center"]}>
				<Avatar name={formatBurgerName(burger, true)} />
				<Text fontSize={"md"} textAlign={["left", "center"]}>
					<strong>{formatBurgerName(burger, true)}</strong>
				</Text>
			</Stack>
		</GridCard>
	);
};

const HuishoudenBurgersView: React.FC<{huishouden: Huishouden, onClickAddButton?: VoidFunction}> = ({huishouden, onClickAddButton}) => {
	const burgers: Burger[] = huishouden.burgers || [];

	return (
		<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)", "repeat(6, 1fr)"]} gap={5}>
			{onClickAddButton && (
				<Box>
					<DashedAddButton onClick={onClickAddButton} />
				</Box>
			)}
			{burgers.map((b, i) => {
				return <HuishoudenBurgerItem key={i} burger={b} />;
			})}
		</Grid>
	);
};

export default HuishoudenBurgersView;
