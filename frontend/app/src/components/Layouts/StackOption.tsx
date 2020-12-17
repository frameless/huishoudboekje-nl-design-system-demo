import {Badge, Box, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Afspraak} from "../../generated/graphql";
import {formatBurgerName, intervalString} from "../../utils/things";
import Currency from "../Currency";

const StackOption = (props) => {
	const {data, innerProps, innerRef} = props;
	const {afspraak: a}: { afspraak: Afspraak } = data;
	const {t} = useTranslation();

	return (
		<Stack direction={"row"} spacing={2} alignItems={"center"} px={5} py={1} width={"100%"} ref={innerRef} {...innerProps} _hover={{
			bg: "gray.100"
		}} {...props.isSelected && {
			bg: "gray.100"
		}}>
			<Box flex={0}>
				<Text>#{a.id}</Text>
			</Box>
			<Box flex={2}>
				<Text>{a.beschrijving}</Text>
				<Stack direction={"row"} spacing={1}>
					{a.rubriek && <Badge colorScheme={"yellow"} fontWeight={"normal"}>{a.rubriek.naam}</Badge>}
					{a.interval && <Badge colorScheme={"yellow"} fontWeight={"normal"}>{intervalString(a.interval, t)}</Badge>}
				</Stack>
			</Box>
			<Box flex={2}>
				<Text>{a.gebruiker ? formatBurgerName(a.gebruiker) : "Onbekende gebruiker"}</Text>
			</Box>
			<Box flex={0}>
				<Currency value={(a.bedrag * (a.credit ? 1 : -1))} />
			</Box>
		</Stack>
	);
}

export default StackOption;