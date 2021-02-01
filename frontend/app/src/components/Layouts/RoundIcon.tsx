import {chakra, Flex} from "@chakra-ui/react";

const RoundIcon = chakra(Flex, {
	baseStyle: {
		w: 8, h: 8,
		borderRadius: "100%",
		border: "1px solid",
		borderColor: "gray.300",
		justifyContent: "center",
		alignItems: "center",
	}
});

export default RoundIcon;