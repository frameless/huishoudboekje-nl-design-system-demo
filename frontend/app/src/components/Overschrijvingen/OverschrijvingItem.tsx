import {Badge, Box, Stack, StackProps, Text} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import {useIsMobile} from "react-grapple";
import {Overschrijving, OverschrijvingStatus} from "../../generated/graphql";
import Currency from "../Currency";

const OverschrijvingItem: React.FC<{ overschrijving: Overschrijving, showStatus?: boolean } & StackProps> = ({overschrijving, showStatus = true, ...props}) => {
	const {datum, bedrag, status} = overschrijving;
	const isMobile = useIsMobile();

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

	return isMobile ? (
		<Stack direction={"row"} py={3} {...props}>
			<Box flex={1} justifyContent={"flex-end"}>
				<Text>{moment(datum).format("dd L")}</Text>
				<Text><Badge colorScheme={getOverschrijvingStatusColor()}>{status}</Badge></Text>
			</Box>
			<Currency maxWidth={150} minWidth={"auto"} value={bedrag} text={{fontWeight: "bolder"}} />
		</Stack>
	) : (
		<Stack direction={"row"} {...props}>
			<Box flex={1}>
				{moment(datum).format("dd L")}
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