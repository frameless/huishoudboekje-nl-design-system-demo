import {Stack, StackProps, Text} from "@chakra-ui/react";
import React from "react";
import Label from "./Label";

const DataItem: React.FC<StackProps & {label?: string}> = ({label, children, ...props}) => {
	return (
		<Stack spacing={0} flex={1} {...props}>
			<Label>{label}</Label>
			{typeof children === "string" ? <Text>{children}</Text> : children}
		</Stack>
	);
};

export default DataItem;