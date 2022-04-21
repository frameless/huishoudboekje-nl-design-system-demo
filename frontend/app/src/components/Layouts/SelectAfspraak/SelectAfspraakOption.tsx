import {CheckIcon} from "@chakra-ui/icons";
import {Stack, TableRowProps, Tag, TagLabel, TagLeftIcon, Td, Text, Tr, Wrap, WrapItem} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Afspraak} from "../../../generated/graphql";
import {currencyFormat2, formatBurgerName, truncateText} from "../../../utils/things";

type SelectAfspraakOptionProps = TableRowProps & {
	afspraak: Afspraak,
	isSuggestion?: boolean,
};

const SelectAfspraakOption: React.FC<SelectAfspraakOptionProps> = ({afspraak, isSuggestion = false, ...props}) => {
	const {t} = useTranslation();
	const zoektermen: string[] = afspraak.zoektermen || [];

	return (
		<Tr _hover={{
			cursor: "pointer",
			bg: "gray.100",
		}} {...props}>
			<Td>
				<Text>{afspraak.burger ? formatBurgerName(afspraak.burger) : t("unknownBurger")}</Text>
			</Td>
			<Td>
				<Text>{afspraak.omschrijving}</Text>
			</Td>
			<Td>
				<Wrap spacing={1}>
					{zoektermen.map(z => (
						<WrapItem title={z}>{truncateText(z, 35)}</WrapItem>
					))}
				</Wrap>
			</Td>
			<Td>
				{isSuggestion && (
					<Tag colorScheme={"green"} size={"sm"} variant={"subtle"}>
						<TagLeftIcon boxSize={"12px"} as={CheckIcon} />
						<TagLabel>{t("suggestion")}</TagLabel>
					</Tag>
				)}
			</Td>
			<Td isNumeric>
				<Stack direction={"row"} justifyContent={"space-between"}>
					<Text>&euro;</Text>
					<Text>{currencyFormat2(false).format(afspraak.bedrag * (afspraak.credit ? 1 : -1))}</Text>
				</Stack>
			</Td>
		</Tr>
	);
};

export default SelectAfspraakOption;