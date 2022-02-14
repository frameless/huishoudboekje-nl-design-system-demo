import {As, Box, Stack, Text} from "@chakra-ui/react";
import React from "react";
import EmptyIllustration from "../Illustrations/EmptyIllustration";

type DeadEndPageProps = {
	illustration?: As,
	message?: string
};

const DeadEndPage: React.FC<DeadEndPageProps> = ({illustration = EmptyIllustration, message, children}) => {
	return (
		<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} p={20} spacing={10} borderRadius={5}>
			{illustration && <Box as={illustration} width={"100%"} maxWidth={[200, 300, 400]} height={[200, 300]} justifyContent={"center"} alignItems={"center"} />}
			{message && <Text fontSize={"sm"}>{message}</Text>}
			{children}
		</Stack>
	);
};

export default DeadEndPage;