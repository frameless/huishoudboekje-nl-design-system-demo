import {
	CheckIcon,
	WarningIcon,
	InfoIcon
} from "@chakra-ui/icons";
import {
	Box,
	BoxProps,
	Icon,
	Stack,
	Tag,
	Text,
	useBreakpointValue,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	PopoverArrow,
	useDisclosure,
} from '@chakra-ui/react'
import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {
	currencyFormat2,
	formatIBAN
} from "../../../utils/things";
import PrettyIban from "../../shared/PrettyIban";
import { BankTransaction } from "../../../generated/graphql";

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
	const { isOpen, onOpen, onClose } = useDisclosure();


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
					navigate(AppRoutes.ViewTransactie(String(bank_transaction.id)));
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
					<Popover
						isOpen={isOpen}
						placement='bottom-end'
					>
						<PopoverTrigger>
							<Text>
								<Icon
									as={InfoIcon}
									color="blue.400"
									marginLeft="1.5"
									onMouseEnter={onOpen}
									onMouseLeave={onClose}
								/>
							</Text>
						</PopoverTrigger>
						<PopoverContent
							color='white'
							bg='blue.800'
							borderColor='blue.800'
							onMouseLeave={onClose}
							maxWidth='400'
						>
							<PopoverArrow bg='blue.800' />
							<PopoverBody>
								<Box 
									flex="2"
									width="100%"
								>
									<Text marginBottom={3}>
											<h4><strong>{t("transactions.description")}:</strong></h4>
											<p>
												{bank_transaction.statementLine}<br/><br/>
												{bank_transaction.informationToAccountOwner?.replace(/\s+/g, ' ')}
											</p>
									</Text>
									<Text marginBottom={2}>
										<h4><strong>{t("transacties.tegenrekening")}:</strong></h4>
										<p>{bank_transaction.tegenRekening?.rekeninghouder || t("unknown")}</p>
									</Text>
									<Text marginBottom={2}>
										<h4><strong>{t("forms.rekeningen.fields.iban")}:</strong></h4>
										<p>{formatIBAN(bank_transaction.tegenRekening?.iban) || t("unknown")}</p>
									</Text>
								</Box>
							</PopoverBody>
						</PopoverContent>
					</Popover>
				</Box>
			</Stack>
		</Box>
	);
};

export default TransactieItem;
