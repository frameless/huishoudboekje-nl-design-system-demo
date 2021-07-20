import {Avatar, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {NavLink} from "react-router-dom";
import Routes from "../../config/routes";
import {Huishouden} from "../../generated/graphql";
import {formatBurgerName} from "../../utils/things";
import GridCard from "../Layouts/GridCard";

const HuishoudenListItem: React.FC<{huishouden: Huishouden}> = ({huishouden}) => {
	/* If the Huishouden contains only one Burger, link directly to the Burger's detail page instead of the Huishouden detail page. */
	const linkTo = huishouden.burgers?.length === 1 ? Routes.Burger(huishouden.burgers[0]?.id) : Routes.Huishouden(huishouden.id);

	return (
		<GridCard justify={"flex-start"} as={NavLink} to={linkTo}>
			<Stack direction={["row", "column"]} spacing={5}>
				{huishouden.burgers?.map(b => (
					<Stack key={b.id} spacing={3} direction={"row"} align={"center"}>
						<Avatar size={"xs"} name={formatBurgerName(b)} />
						<Text fontSize={"md"}><strong>{formatBurgerName(b)}</strong></Text>
					</Stack>
				))}
			</Stack>
		</GridCard>
	);
};

export default HuishoudenListItem;