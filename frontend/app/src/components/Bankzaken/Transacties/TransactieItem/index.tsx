import {WarningIcon} from "@chakra-ui/icons";
import {Box, BoxProps, Flex, Stack, Tag, TagLabel, TagLeftIcon, Text, Tooltip, useBreakpointValue, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {BankTransaction} from "../../../../generated/graphql";
import {formatIBAN} from "../../../../utils/things";
import Currency from "../../../Layouts/Currency";
import PrettyIban from "../../../Layouts/PrettyIban";
import TransactieItemModal from "./TransactieItemModal";

const hoverStyles = {
	_hover: {
		bg: "gray.100",
		cursor: "pointer",
	},
};

const TransactieItem: React.FC<BoxProps & {transactie: BankTransaction}> = ({transactie: bt, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const modal = useDisclosure();

	return (
		<Box px={2} mx={-2} {...!isMobile && hoverStyles}>
			{!isMobile && (
				<TransactieItemModal transactie={bt} disclosure={modal} />
			)}

			<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} {...props} onClick={!isMobile ? modal.onOpen : () => false}>

				<Box flex={2}>
					{bt.tegenRekening ? (
						<Text>
							<Tooltip label={formatIBAN(bt.tegenRekening.iban) || t("unknown")} aria-label={formatIBAN(bt.tegenRekening.iban) || t("unknown")} placement={"right"}>
								<span>{bt.tegenRekening.rekeninghouder}</span>
							</Tooltip>
						</Text>
					) : (
						<Text whiteSpace={"nowrap"}>
							<PrettyIban iban={bt.tegenRekeningIban} />
						</Text>
					)}
				</Box>

				{!isMobile && (
					<Flex flex={1} width={"100%"} alignItems={"center"}>
						{bt.journaalpost ? (
							<Text fontSize={"sm"}>{bt.journaalpost.afspraak?.rubriek?.naam || bt.journaalpost.grootboekrekening?.rubriek?.naam}</Text>
						) : (
							<Tag colorScheme={"red"} size={"sm"} variant={"subtle"}>
								<TagLeftIcon boxSize="12px" as={WarningIcon} />
								<TagLabel>
									{t("unbooked")}
								</TagLabel>
							</Tag>
						)}
					</Flex>
				)}

				<Box flex={0} minWidth={120}>
					<Currency minWidth={120} value={bt.bedrag} />
				</Box>

			</Stack>
		</Box>
	);
};

export default TransactieItem;