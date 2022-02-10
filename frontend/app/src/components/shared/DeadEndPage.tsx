import {Box, BoxProps, Stack, Text} from "@chakra-ui/react";
import React from "react";
import EmptyIllustration from "../Illustrations/EmptyIllustration";

const DeadEndPage: React.FC<BoxProps & {illustration?, message?: string}> = ({illustration = EmptyIllustration, message, children, ...props}) => {
	return (
		<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} p={20} spacing={10} borderRadius={5} {...props}>
			{illustration && <Box as={illustration} width={"100%"} maxWidth={[200, 300, 400]} height={[200, 300]} justifyContent={"center"} alignItems={"center"} />}
			{message && <Text fontSize={"sm"}>{message}</Text>}
			{children}
		</Stack>
	);
};

export default DeadEndPage;