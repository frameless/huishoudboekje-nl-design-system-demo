import {Avatar, Grid, Stack, Text, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {NavLink} from "react-router-dom";
import Routes from "../../../config/routes";
import {Burger} from "../../../generated/graphql";
import {formatBurgerName} from "../../../utils/things";
import GridCard from "../../Layouts/GridCard";

const HuishoudenBurgersView: React.FC<{burgers: Burger[]}> = ({burgers = []}) => {
	const isMobile = useBreakpointValue([true, null, null, false]);

	return (
		<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)", "repeat(6, 1fr)"]} gap={5}>
			{burgers.map((b, i) => (
				<GridCard as={NavLink} key={i} justifyContent={["flex-start", "center"]} to={Routes.Burger(b.id)}>
					<Stack direction={["row", "column"]} spacing={5} alignItems={"center"}>
						<Avatar name={formatBurgerName(b, true)} />
						<Text fontSize={"md"} {...!isMobile && {textAlign: "center"}}>
							<strong>{formatBurgerName(b, true)}</strong>
						</Text>
					</Stack>
				</GridCard>
			))}
		</Grid>
	);
};

export default HuishoudenBurgersView;