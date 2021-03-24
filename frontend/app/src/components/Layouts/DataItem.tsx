import {FormLabel, Stack, StackProps, Text} from "@chakra-ui/react";
import React from "react";

const DataItem: React.FC<StackProps & {label?: string}> = ({label, children, ...props}) => {
	return (
		<Stack spacing={0} flex={1} {...props}>
			<FormLabel mb={0}>{label}</FormLabel>
			{typeof children === "string" ? <Text>{children}</Text> : children}
		</Stack>
	);
};

export default DataItem;