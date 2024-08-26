import {
	CheckIcon,
	WarningIcon,
} from "@chakra-ui/icons";
import {
	Box,
	BoxProps,
	Icon,
	Stack,
	Tag,
	Text,
	useBreakpointValue,
} from '@chakra-ui/react'
import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import { currencyFormat2 } from "../../../utils/things";
import PrettyIban from "../../shared/PrettyIban";
import { BankTransaction } from "../../../generated/graphql";
import TransactiePopover from "./TransactiePopover"

const hoverStyles = {
	_hover: {
		bg: "gray.100",
		cursor: "pointer",
	},
};

type TransactieItemProps = BoxProps & {
	transactie: BankTransaction
};

const TransactieItem: React.FC<TransactieItemProps> = ({transactie: bank_transaction, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const navigate = useNavigate();


	return (
		<Box
			px={2}
			mx={-2}
			{...!isMobile && hoverStyles}
		>
			<Stack
				direction={"row"}
				alignItems={"center"}
				justifyContent={"center"}
				onClick={() => {
					navigate(AppRoutes.ViewTransactie(String(bank_transaction.uuid)));
				}}
				{...props}
			>
				{bank_transaction.isGeboekt ? (
					<Tag
						colorScheme={"green"}
						size={"sm"}
						variant={"subtle"}
					>
						<Icon as={CheckIcon} />
					</Tag>
				) : (
					<Tag
						colorScheme={"red"}
						size={"sm"}
						variant={"subtle"}
					>
						<Icon as={WarningIcon} />
					</Tag>
				)}

				<Box flex={2}>
					{bank_transaction.tegenRekening ? (
						<Text>
							<span>{bank_transaction.tegenRekening.rekeninghouder}</span>
						</Text>
					) : (
						<Text whiteSpace={"nowrap"}>
							<PrettyIban iban={bank_transaction.tegenRekeningIban} fallback={t("unknownIban")} />
						</Text>
					)}
				</Box>

				<Box
					flex={0}
					minWidth={250}
				>
					<Stack
						direction={"row"}
						justifyContent={"space-between"}
					>
						<Text>
							{
								bank_transaction.journaalpost?.rubriek 
									? bank_transaction.journaalpost?.rubriek.naam 
									: ""
							}
						</Text>
					</Stack>
				</Box>

				<Box
					flex={0}
					minWidth={120}
				>
					<Stack
						direction={"row"}
						justifyContent={"space-between"}
					>
						<Text>&euro;</Text>
						<Text>{currencyFormat2(false).format(bank_transaction.bedrag)}</Text>
					</Stack>
				</Box>

				<Box
					flex={0}
				>
					<TransactiePopover bank_transaction={bank_transaction} />
				</Box>
			</Stack>
		</Box>
	);
};

export default TransactieItem;
