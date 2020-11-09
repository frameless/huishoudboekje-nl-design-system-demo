import React from "react";
import {Box, BoxProps, Stack} from "@chakra-ui/core";
import {useIsMobile} from "react-grapple";
import {IAfspraak} from "../../models";
import {numberFormat} from "../../utils/things";

const AfspraakItem: React.FC<BoxProps & {afspraak: IAfspraak}> = ({afspraak: a, ...props}) => {
	const isMobile = useIsMobile();

	return (
		<Stack direction={isMobile ? "column" : "row"} {...props}>
			<Box>{a.tegenrekening?.rekeninghouder || "Onbekend"}</Box>
			<Box>&euro; {numberFormat.format(a.bedrag)}</Box>
			<Box>{JSON.stringify(a.interval, null, 2)}</Box>
		</Stack>
	);
};

export default AfspraakItem;