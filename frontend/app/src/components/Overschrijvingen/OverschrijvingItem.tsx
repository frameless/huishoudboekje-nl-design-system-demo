import {Badge, Box, Stack, StackProps} from "@chakra-ui/react";
import React from "react";
import {Overschrijving, OverschrijvingStatus} from "../../generated/graphql";
import d from "../../utils/dayjs";
import Currency from "../Currency";

const OverschrijvingItem: React.FC<{ overschrijving: Overschrijving, showStatus?: boolean } & StackProps> = ({overschrijving, showStatus = true, ...props}) => {
	const {datum, bedrag, status} = overschrijving;

	const getOverschrijvingStatusColor = () => {
		switch (status) {
			case OverschrijvingStatus.Gereed:
				return "green";
			case OverschrijvingStatus.InBehandeling:
				return "yellow";
			case OverschrijvingStatus.Verwachting:
			default:
				return "gray";
		}
	};

	return (
		<Stack direction={"row"} {...props}>
			<Box flex={1}>
				{d(datum).format("L")}
			</Box>
			{showStatus && <Box flex={1}>
				<Badge colorScheme={getOverschrijvingStatusColor()}>{status}</Badge>
			</Box>}
			<Box flex={1} maxWidth={150}>
				<Currency value={bedrag} />
			</Box>
		</Stack>
	);
};

export default OverschrijvingItem;