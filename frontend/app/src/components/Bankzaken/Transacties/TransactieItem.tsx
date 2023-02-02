import {WarningIcon} from "@chakra-ui/icons";
import {Box, BoxProps, Flex, Stack, Tag, TagLabel, TagLeftIcon, Text, Tooltip, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {BankTransaction} from "../../../generated/graphql";
import {currencyFormat2, formatIBAN} from "../../../utils/things";
import PrettyIban from "../../shared/PrettyIban";
import { TransactionSimple } from "./TransactieOverzichtObject";

const hoverStyles = {
	_hover: {
		bg: "gray.100",
		cursor: "pointer",
	},
};

type TransactieItemProps = BoxProps & {
	transactie: TransactionSimple
};

const TransactieItem: React.FC<TransactieItemProps> = ({transactie: bt, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const navigate = useNavigate();

	return (
		<Box px={2} mx={-2} {...!isMobile && hoverStyles}>
			<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} {...props} onClick={() => {
				navigate(AppRoutes.ViewTransactie(String(bt.id)));
			}}>

				<Box flex={2}>
					{bt.tegenRekening ? (
						<Text>
							<Tooltip label={formatIBAN(bt.tegenRekening.iban) || t("unknown")} aria-label={formatIBAN(bt.tegenRekening.iban) || t("unknown")} placement={"right"}>
								<span>{bt.tegenRekening.rekeninghouder}</span>
							</Tooltip>
						</Text>
					) : (
						<Text whiteSpace={"nowrap"}>
							<PrettyIban iban={bt.tegenRekeningIban} fallback={t("unknownIban")} />
						</Text>
					)}
				</Box>

				{!isMobile && (
					<Flex flex={1} width={"100%"} alignItems={"center"}>
						{bt.rubriek ? (
							<Text fontSize={"sm"}>{bt.rubriek}</Text>
						) : (
							<Tag colorScheme={"red"} size={"sm"} variant={"subtle"}>
								<TagLeftIcon boxSize={"12px"} as={WarningIcon} />
								<TagLabel>
									{t("unbooked")}
								</TagLabel>
							</Tag>
						)}
					</Flex>
				)}

				<Box flex={0} minWidth={120}>
					<Stack direction={"row"} justifyContent={"space-between"}>
						<Text>&euro;</Text>
						<Text>{currencyFormat2(false).format(bt.bedrag)}</Text>
					</Stack>
				</Box>

			</Stack>
		</Box>
	);
};

export default TransactieItem;
