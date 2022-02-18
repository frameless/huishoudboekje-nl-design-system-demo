import {FormLabel, Stack, Text} from "@chakra-ui/react";
import React from "react";

type DataItemProps = {
	label: string
};

const DataItem: React.FC<DataItemProps> = ({label, children}) => {
	return (
		<Stack spacing={0} flex={1}>
			<FormLabel mb={0}>{label}</FormLabel>
			{typeof children === "string" ? <Text>{children}</Text> : children}
		</Stack>
	);
};

export default DataItem;