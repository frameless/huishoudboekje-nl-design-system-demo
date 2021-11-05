import {Stack, Text, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {Afdeling} from "../../generated/graphql";
import GridCard from "../Layouts/GridCard";
import AfdelingListItemModal from "./AfdelingListItemModal";

const AfdelingListItem: React.FC<{afdeling: Afdeling}> = ({afdeling}) => {
	const detailsModal = useDisclosure();

	return (<>
		<AfdelingListItemModal afdeling={afdeling} disclosure={detailsModal} />

		<GridCard justify={["flex-start", "center"]} onClick={() => detailsModal.onOpen()} position={"relative"}>
			<Stack direction={["row", "column"]} spacing={5} align={"center"} justify={["flex-start", "center"]}>
				<Text fontSize={"md"} overflowX={"hidden"} textOverflow={"ellipsis"} width={"100%"} title={afdeling.naam}>
					<strong>{afdeling.naam}</strong>
				</Text>
			</Stack>
		</GridCard>
	</>);
};

export default AfdelingListItem;