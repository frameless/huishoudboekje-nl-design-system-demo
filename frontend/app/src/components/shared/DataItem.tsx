import {FormLabel, Stack, Text} from "@chakra-ui/react";
import React, {ReactNode} from "react";

type DataItemProps = {
	label: string,
	children: ReactNode
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