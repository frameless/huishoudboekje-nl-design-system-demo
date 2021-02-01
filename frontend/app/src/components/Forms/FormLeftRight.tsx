import React from "react";
import {Heading, Stack, StackProps, Text} from "@chakra-ui/react";
import theme from "../../config/theme";

type FormLeftProps = {
	title?: string,
	helperText?: string,
}

export const FormLeft: React.FC<StackProps & FormLeftProps> = ({title, helperText, children, ...props}) => (
	<Stack flex={1} spacing={1} alignItems={"flex-start"} {...props}>
		{title && <Heading size={"md"}>{title}</Heading>}
		{helperText && <Text fontSize={"md"} color={"gray.500"}>{helperText}</Text>}
		{children}
	</Stack>
);

export const FormRight: React.FC<StackProps> = (props) => (
	<Stack flex={2} spacing={4} {...props} />
);

export const Label: React.FC = ({children}) => (
	<Text fontSize={"sm"} color={theme.colors.gray["500"]}>{children}</Text>
);