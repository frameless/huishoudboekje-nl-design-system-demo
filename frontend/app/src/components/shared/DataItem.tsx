import {FormLabel, Stack, Text} from "@chakra-ui/react";
import React from "react";

const DataItem: React.FC<{label?: string}> = ({label, children}) => {
	return (
		<Stack spacing={0} flex={1}>
			<FormLabel mb={0}>{label}</FormLabel>
			{typeof children === "string" ? <Text>{children}</Text> : children}
		</Stack>
	);
};

export default DataItem;