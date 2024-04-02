import {Avatar, Badge, Box, Grid, Stack, Text, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {Burger} from "../../generated/graphql";
import {formatBurgerName, getBurgerHhbId} from "../../utils/things";
import DashedAddButton from "../shared/DashedAddButton";
import GridCard from "../shared/GridCard";

type BurgerListViewProps = {
	burgers: Burger[],
	showAddButton?: boolean
};

const BurgerListView: React.FC<BurgerListViewProps> = ({burgers, showAddButton = false}) => {
	const navigate = useNavigate();
	const isMobile = useBreakpointValue([true, null, null, false]);

	// const signalen = burgers.reduce((list, burger: Burger) => {
	// 	const signalen = (burger.afspraken || [])
	// 		.map(a => a.alarm)
	// 		.map(a => a?.signaal)
	// 		.filter(s => s?.isActive)
	// 		.filter(s => s !== undefined);

	// 	list.push(...signalen as Signaal[]);
	// 	return list;
	// }, [] as Signaal[]);

	return (
		<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)", "repeat(6, 1fr)"]} gap={5}>
			{showAddButton && (
				<Box>
					<DashedAddButton onClick={() => navigate(AppRoutes.CreateBurger())} />
				</Box>

			)}
			{burgers.map((g, i) => (
				<GridCard key={i} justifyContent={["flex-start", "center"]} position={"relative"} onClick={() => {
					navigate(AppRoutes.ViewBurger(String(g.id)));
				}}>
					{/* {signalen.length > 0 && (
						<Box position={"absolute"} top={1} right={1}>
							<Badge fontSize={"0.8rem"} p={1} colorScheme={"secondary"}>
								{signalen.length > 99 ? "99+" : signalen.length}
							</Badge>
						</Box>
					)} */}
					<Stack direction={["row", "column"]} spacing={5} alignItems={"center"}>
						<Avatar name={formatBurgerName(g, true)} />
						<Text fontSize={"md"} {...!isMobile && {textAlign: "center"}}><strong>{`${g.voornamen} ${g.achternaam}`}</strong></Text>
						<Text fontSize={"sm"} textColor={"gray"} {...!isMobile && {textAlign: "center"}}><strong>{`${getBurgerHhbId(g)}`}</strong></Text>
					</Stack>
				</GridCard>
			))}
		</Grid>
	);
};

export default BurgerListView;