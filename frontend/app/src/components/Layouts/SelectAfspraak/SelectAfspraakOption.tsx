import {CheckIcon, DeleteIcon} from "@chakra-ui/icons";
import {Box, IconButton, TableRowProps, Tag, TagLabel, TagLeftIcon, Td, Text, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Afspraak} from "../../../generated/graphql";
import {formatBurgerName} from "../../../utils/things";
import Currency from "../../Currency";

type SelectAfspraakOptionProps = TableRowProps & {
	afspraak: Afspraak,
	enableHover?: boolean,
	isSuggestion?: boolean,
	isLoading?: boolean,
	onDelete?: VoidFunction,
};

const SelectAfspraakOption: React.FC<SelectAfspraakOptionProps> = (props) => {
	const {
		afspraak,
		enableHover = true,
		isSuggestion = false,
		isLoading = false,
		onDelete,
		...rest
	} = props;
	const {t} = useTranslation();

	return (
		<Tr {...enableHover && {
			_hover: {
				cursor: "pointer",
				bg: "gray.100",
			},
		}} {...rest}>
			<Td>
				<Text>{afspraak.beschrijving}</Text>
			</Td>
			<Td>
				<Text>{afspraak.kenmerk}</Text>
			</Td>
			<Td>
				<Text>{afspraak.gebruiker ? formatBurgerName(afspraak.gebruiker) : t("unknownBurger")}</Text>
			</Td>
			<Td>
				{isSuggestion && (
					<Tag colorScheme={"green"} size={"sm"} variant={"subtle"}>
						<TagLeftIcon boxSize="12px" as={CheckIcon} />
						<TagLabel>{t("suggestion")}</TagLabel>
					</Tag>
				)}
			</Td>
			<Td isNumeric>
				<Currency value={(afspraak.bedrag * (afspraak.credit ? 1 : -1))} />
			</Td>
			<Td isNumeric>
				{onDelete && (
					<Box>
						<IconButton icon={<DeleteIcon />} variant={"ghost"} aria-label={t("actions.disconnect")} onClick={onDelete} isLoading={isLoading} />
					</Box>
				)}
			</Td>
		</Tr>
	);
};

export default SelectAfspraakOption;