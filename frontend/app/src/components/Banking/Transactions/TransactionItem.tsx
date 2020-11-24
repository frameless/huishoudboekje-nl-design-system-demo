import {Badge, Box, BoxProps, Icon, Stack, Text, Tooltip} from "@chakra-ui/core";
import {friendlyFormatIBAN} from "ibantools";
import React from "react";
import {useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {IBankTransaction} from "../../../models";
import Currency from "../../Currency";

const TransactionItem: React.FC<BoxProps & { bankTransaction: IBankTransaction }> = ({bankTransaction: a, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useIsMobile();

	return (
		<Stack borderTop={"1px solid"} borderTopColor={"gray.200"} direction={"row"} alignItems={"center"} justifyContent={"center"} {...props}>
			<Box flex={2}>{a.tegenRekening ? (<>
				<Text>
					<Tooltip label={friendlyFormatIBAN(a.tegenRekening.iban)} aria-label={friendlyFormatIBAN(a.tegenRekening.iban)} placement={"right"} hasArrow={true}>
						<span>{a.tegenRekening.rekeninghouder}</span>
					</Tooltip>
				</Text>
			</>) :
				<Text whiteSpace={"nowrap"}>{friendlyFormatIBAN(a.tegenRekeningIban) || t("unknown")}</Text>
			}
			</Box>
			{!isMobile && (
				<Box flex={1}>
					<Badge fontSize={"12px"}>{a.journaalpost?.grootboekrekening.naam || t("unknown")}</Badge>
				</Box>
			)}
			<Box flex={1}>
				<Currency value={a.bedrag} />
			</Box>
			<Box flex={0} pl={3}>
				<Icon name={a.journaalpost ? "check-circle" : "question"} color={a.journaalpost ? "gray.500" : "yellow.500"} />
			</Box>
			{/* Todo: Later uit te breiden met geboekt op specifieke afspraak als deze bekend is */}
		</Stack>
	);
};

export default TransactionItem;