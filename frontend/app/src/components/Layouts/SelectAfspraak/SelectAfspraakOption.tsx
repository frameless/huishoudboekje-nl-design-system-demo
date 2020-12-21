import {Badge, Box, Stack, StackProps, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Afspraak} from "../../../generated/graphql";
import {formatBurgerName, intervalString} from "../../../utils/things";
import Currency from "../../Currency";

type SelectAfspraakOptionProps = StackProps & {
	afspraak: Afspraak,
	enableHover?: boolean,
	isSelected?: boolean,
};

const SelectAfspraakOption: React.FC<SelectAfspraakOptionProps> = ({ afspraak: a, enableHover = true, isSelected = false, ...props}) => {
	const {t} = useTranslation();

	return (
		<Stack direction={"row"} spacing={2} alignItems={"center"} py={1} width={"100%"} {...enableHover && {_hover: {
			cusor: "pointer",
			bg: "gray.100"
		}}} {...isSelected && {
			bg: "gray.100"
		}} {...props}>
			<Box flex={2}>
				<Text>{a.beschrijving}</Text>
				<Stack direction={"row"} spacing={1}>
					{a.rubriek && <Badge colorScheme={"yellow"} fontWeight={"normal"}>{a.rubriek.naam}</Badge>}
					{a.interval && <Badge colorScheme={"yellow"} fontWeight={"normal"}>{intervalString(a.interval, t)}</Badge>}
				</Stack>
			</Box>
			<Box flex={1}>
				<Text>{a.kenmerk}</Text>
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

export default SelectAfspraakOption;