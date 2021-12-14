import {Avatar, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {NavLink} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {Huishouden} from "../../generated/graphql";
import {formatBurgerName} from "../../utils/things";
import GridCard from "../Layouts/GridCard";

const HuishoudenListItem: React.FC<{huishouden: Huishouden}> = ({huishouden}) => {
	return (
		<GridCard justify={"flex-start"} as={NavLink} to={AppRoutes.Huishouden(huishouden.id)}>
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