import {chakra, Text} from "@chakra-ui/react";

const Label = chakra(Text, {
	baseStyle: {
		fontWeight: "normal",
		textTransform: "none",
		letterSpacing: "none",
		fontSize: "sm",
		color: "gray.500",
	},
});

export default Label;