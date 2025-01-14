import {Heading, Stack, StackProps, Text} from "@chakra-ui/react";
import React from "react";

type FormLeftProps = StackProps & {
	title?: string,
	helperText?: string,
}

export const FormLeft: React.FC<FormLeftProps> = ({title, helperText, children, ...props}) => (
	<Stack flex={1} alignItems={"flex-start"} {...props}>
		{title && <Heading size={"md"}>{title}</Heading>}
		{helperText && <Text fontSize={"md"} color={"gray.500"}>{helperText}</Text>}
		{children}
	</Stack>
);

export const FormRight: React.FC<StackProps> = (props) => (
	<Stack flex={2} {...props} />
);