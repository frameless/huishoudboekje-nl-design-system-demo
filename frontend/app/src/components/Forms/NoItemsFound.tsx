import React, { MouseEventHandler } from "react";
import { useHistory } from "react-router-dom";
import { Box, Button, Stack, Text } from "@chakra-ui/core";

import EmptyIllustration from "../Illustrations/EmptyIllustration";

type NoItemsFoundProps = {
	onClick: MouseEventHandler<HTMLButtonElement>
	buttonLabel: string
	hint: string
}
export const NoItemsFound = ({ onClick, buttonLabel, hint}: NoItemsFoundProps) => {
	const { push } = useHistory();

	return (
		<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} borderRadius={5} p={20} spacing={10}>
			<Box as={EmptyIllustration} maxWidth={[200, 300, 400]} height={"auto"} />
			<Text fontSize={"sm"}>{hint}</Text>
			<Button onClick={onClick} size={"sm"} variantColor={"primary"} variant={"solid"}
					leftIcon={"add"}>{buttonLabel}</Button>
		</Stack>
	);
};

export default NoItemsFound;