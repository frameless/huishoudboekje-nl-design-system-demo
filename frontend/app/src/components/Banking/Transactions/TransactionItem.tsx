import React from "react";
import { useIsMobile } from "react-grapple";
import { useTranslation } from "react-i18next";
import { Badge, Box, BoxProps, Button, Icon, IconButton, Stack, Text } from "@chakra-ui/core";
import GridCard from "../../GridCard";
import { currencyFormat } from "../../../utils/things";
import { IBankTransaction } from "../../../models";

const TransactionItem: React.FC<BoxProps & { bankTransaction: IBankTransaction }> = ({ bankTransaction: a, ...props }) => {
	const isMobile = useIsMobile();
	const { t } = useTranslation();

	return isMobile ? (
		<GridCard cursor={"default"} {...props}>
			<Stack direction={"row"} width={"100%"} alignItems={"center"} justifyContent={"center"}>
				<Stack spacing={1} flex={1}>
					<Text><Icon name={a.journaalpost ? "check-circle" : "not-allowed"} /></Text>
				</Stack>
				<Stack spacing={1} flex={1}>
					<Text>{a.transactieDatum}</Text>
				</Stack>
				<Stack spacing={1} flex={1}>
					<Text>{a.tegenRekening ? a.tegenRekening.rekeninghouder : a.tegenRekeningIban || t("unknown")}
					</Text>
				</Stack>
				<Stack spacing={1} flex={1} alignItems={"flex-end"}>
					<Box flex={1}>{a.isCredit || "-"}{currencyFormat.format(a.bedrag)}</Box>
				</Stack>
			</Stack>
		</GridCard>
	) : (
		<Stack borderTop={"1px solid"} borderTopColor={"gray.200"} direction={"row"} alignItems={"center"} justifyContent={"center"} {...props}>
			<Box flex={0}>
				{/*	/!*TODO a11y*!/*/}
				<Text><Icon name={a.journaalpost ? "check-circle" : "not-allowed"} /></Text>
			</Box>
			<Box flex={1}>{a.transactieDatum}</Box>
			<Box flex={2}>{a.tegenRekening ?
				<>
					<Text>{a.tegenRekening.rekeninghouder}</Text>
					<Text fontSize={"14px"} color={"gray.500"}>{a.tegenRekening.iban}</Text>
				</> :
				a.tegenRekeningIban || t("unknown")}
			</Box>
			<Text flex={2} isTruncated title={a.informationToAccountOwner}>{a.informationToAccountOwner}</Text>
			<Box flex={2}>{a.journaalpost?.grootboekrekening.naam || t("unknown")}</Box>
			<Box flex={1}><Text textAlign={"right"}>{currencyFormat.format(a.bedrag)}</Text></Box>
			{/*Later uit te breiden met geboekt op specifieke afspraak als deze bekend is*/}
		</Stack>
	);
};

export default TransactionItem;