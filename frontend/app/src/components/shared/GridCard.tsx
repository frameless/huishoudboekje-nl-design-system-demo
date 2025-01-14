import {chakra, Stack} from "@chakra-ui/react";

const BaseGridCard = chakra(Stack, {
	baseStyle: {
		direction: "column",
		width: "100",
		bg: "white",
		borderRadius: 5,
		p: 5,
		cursor: "pointer",
		userSelect: "none",
		borderWidth: "2px",
		borderColor: "transparent",
		transition: "background 200ms, border 200ms",
		_hover: {
			borderColor: "primary.500",
		},
	},
});

const GridCard = (props) => (
	<BaseGridCard {...props} />
);

export default GridCard;