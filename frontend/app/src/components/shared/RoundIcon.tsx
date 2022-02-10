import {chakra, Flex} from "@chakra-ui/react";

const BaseIcon = chakra(Flex, {
	baseStyle: {
		p: "3px",
		w: 7,
		h: 7,
		borderRadius: "100%",
		border: "1px solid",
		borderColor: "gray.400",
		justifyContent: "center",
		alignItems: "center",
	},
});

const RoundIcon = ({children, ...props}) => (
	<BaseIcon {...props}>{children}</BaseIcon>
);

export default RoundIcon;