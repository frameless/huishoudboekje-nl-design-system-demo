import React from "react";
import {Stack, StackProps, Text} from "@chakra-ui/core";
import theme from "../../config/theme";

export const FormLeft: React.FC<StackProps> = (props) => (
	<Stack flex={1} spacing={1} {...props} />
);

export const FormRight: React.FC<StackProps> = (props) => (
	<Stack flex={2} spacing={4} {...props} />
);

export const Label: React.FC = ({children}) => (
	<Text fontSize={"sm"} color={theme.colors.gray["500"]}>{children}</Text>
);