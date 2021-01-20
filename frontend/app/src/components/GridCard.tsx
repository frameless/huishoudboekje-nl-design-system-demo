import {chakra, Stack} from "@chakra-ui/react";

const GridCard = chakra(Stack, {
	baseStyle: {
		direction: "column",
		width: "100",
		bg: "white",
		borderRadius: 5,
		p: 5,
		cursor: "pointer",
		userSelect: "none",
	},
});

export default GridCard;