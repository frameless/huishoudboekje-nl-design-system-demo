import React from "react";
import { BoxProps, Stack, Text } from "@chakra-ui/core";
import { useIsMobile } from "react-grapple";
import theme from "../../config/theme";

export const FormLeft: React.FC<BoxProps> = (props) => (
	<Stack flex={1} spacing={1} {...props} />
);

export const FormRight: React.FC<BoxProps> = (props) => (
	<Stack flex={2} spacing={4} {...props} />
);
export const Label: React.FunctionComponent = ({ children }) =>
	<Text fontSize={"sm"} color={theme.colors.gray["500"]}>{children}</Text>;

export const Group: React.FC<BoxProps> = ({ children, ...props }) => {
	const isMobile = useIsMobile();
	return (
		<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"} {...props}>{children}</Stack>
	);
};