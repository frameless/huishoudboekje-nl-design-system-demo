import {Stack, Text, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {Afdeling} from "../../generated/graphql";
import GridCard from "../Layouts/GridCard";
import AfdelingModal from "./AfdelingModal";

const AfdelingListItem: React.FC<{afdeling: Afdeling}> = ({afdeling}) => {
	const modal = useDisclosure();

	return (<>
		<AfdelingModal afdeling={afdeling} disclosure={modal} />

		<GridCard key={afdeling.id} justifyContent={"center"} onClick={() => modal.onOpen()}>
			<Stack spacing={1}>
				<Text fontSize={"md"} overflowX={"hidden"} textOverflow={"ellipsis"} width={"100%"} maxW={["300px", "250px"]} title={afdeling.naam}>
					<strong>{afdeling.naam}</strong>
				</Text>
			</Stack>
		</GridCard>
	</>);
};

export default AfdelingListItem;