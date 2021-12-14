import {Stack, Text, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {NavLink} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {Afdeling} from "../../generated/graphql";
import GridCard from "../Layouts/GridCard";

const AfdelingListItem: React.FC<{afdeling: Afdeling}> = ({afdeling}) => {
	const detailsModal = useDisclosure();

	return (
		<GridCard justify={["flex-start", "center"]} onClick={() => detailsModal.onOpen()} position={"relative"} as={NavLink} to={AppRoutes.Afdeling(afdeling.organisatie?.id, afdeling?.id)}>
			<Stack direction={["row", "column"]} spacing={5} align={"center"} justify={["flex-start", "center"]}>
				<Text fontSize={"md"} overflowX={"hidden"} textOverflow={"ellipsis"} width={"100%"} title={afdeling.naam}>
					<strong>{afdeling.naam}</strong>
				</Text>
			</Stack>
		</GridCard>
	);
};

export default AfdelingListItem;