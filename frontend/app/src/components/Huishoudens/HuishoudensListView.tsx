import {Grid} from "@chakra-ui/react";
import React from "react";
import {Huishouden} from "../../generated/graphql";
import HuishoudenListItem from "./HuishoudenListItem";

type HuishoudensListViewProps = {
	huishoudens: Huishouden[],
};

const HuishoudensListView: React.FC<HuishoudensListViewProps> = ({huishoudens = []}) => {
	return (
		<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={5}>
			{huishoudens.map((h) => (
				<HuishoudenListItem key={h.id} huishouden={h} />
			))}
		</Grid>
	);
};

export default HuishoudensListView;
