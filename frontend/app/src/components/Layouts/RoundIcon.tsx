import {chakra, Flex} from "@chakra-ui/react";

const RoundIcon = chakra(Flex, {
	baseStyle: {
		p: "3px",
		w: 8, h: 8,
		borderRadius: "100%",
		border: "1px solid",
		borderColor: "gray.400",
		justifyContent: "center",
		alignItems: "center",
	}
});

export default RoundIcon;