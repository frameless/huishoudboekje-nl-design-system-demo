import {useMutation, useQuery} from "@apollo/client";
import {
	Badge,
	Box,
	BoxProps,
	Button,
	FormLabel,
	Icon,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay, PseudoBox,
	Select,
	Stack,
	Text,
	Tooltip,
	useDisclosure,
	useToast
} from "@chakra-ui/core";
import {friendlyFormatIBAN} from "ibantools";
import React from "react";
import {useInput, useIsMobile, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {IBankTransaction, IRubriek} from "../../../models";
import {CreateJournaalpostGrootboekrekeningMutation} from "../../../services/graphql/mutations";
import {GetAllRubricsQuery} from "../../../services/graphql/queries";
import Queryable from "../../../utils/Queryable";
import {dateFormat} from "../../../utils/things";
import Currency from "../../Currency";
import {Label} from "../../Forms/FormLeftRight";

const TransactionItem: React.FC<BoxProps & { bankTransaction: IBankTransaction }> = ({bankTransaction: bt, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useIsMobile();
	const toast = useToast();
	const {isOpen, onOpen, onClose} = useDisclosure();

	const rubric = useInput({
		validate: [Validators.required]
	});

	const $rubrics = useQuery(GetAllRubricsQuery);
	const [createJournal] = useMutation(CreateJournaalpostGrootboekrekeningMutation);

	const onClickSave = () => {
		if (!rubric.isValid) {
			toast({
				status: "error",
				title: t("messages.agreements.invalidFormMessage"),
				position: "top",
			});
			return;
		}

		createJournal({
			variables: {
				transactionId: bt.id,
				grootboekrekeningId: rubric.value
			}
		}).then(() => {
			toast({
				status: "success",
				title: t("messages.journals.createSuccessMessage"),
				position: "top",
			});
			onClose();
		}).catch(err => {
			console.error(err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				title: t("messages.genericError.title"),
				description: t("messages.genericError.description"),
			});
		});
	}

	return (<>
		<Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={true}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t("forms.banking.sections.journal.title")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>

					<Stack spacing={5}>
						<Box>
							<Label>{t("transactions.beneficiaryAccount")}</Label>
							<Box flex={2}>{bt.tegenRekening ? (
								<Stack spacing={0}>
									<Text>{friendlyFormatIBAN(bt.tegenRekening.iban)}</Text>
									<Text fontSize={"sm"}>{bt.tegenRekening.rekeninghouder}</Text>
								</Stack>
							) : (
								<Text>{friendlyFormatIBAN(bt.tegenRekeningIban) || t("unknown")}</Text>
							)}
							</Box>
						</Box>

						<Stack direction={"row"} justifyContent={"space-between"}>
							<Box>
								<Label>{t("forms.common.fields.date")}</Label>
								<Box>
									<Text>{dateFormat.format(new Date(bt.transactieDatum))}</Text>
								</Box>
							</Box>

							<Box>
								<Label>{t("transactions.amount")}</Label>
								<Box>
									<Currency justifyContent={"flex-start"} value={bt.bedrag} />
								</Box>
							</Box>
						</Stack>

						<Box as={"form"}>

							<FormLabel>{t("banking.rubric")}</FormLabel>
							<Queryable query={$rubrics}>{({rubrieken}) => (
								<Select {...rubric.bind} isInvalid={!rubric.isValid}>
									<option value={undefined}>{t("forms.banking.fields.rubricChoose")}</option>
									{rubrieken.map((r: IRubriek) => (
										<option key={r.id} value={r.grootboekrekening.id}>{r.naam}</option>
									))}
								</Select>
							)}</Queryable>
						</Box>
					</Stack>

				</ModalBody>
				<ModalFooter>
					<Button variantColor={"primary"} onClick={() => onClickSave()}>{t("actions.save")}</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>

		<PseudoBox px={2} mx={-2} _hover={{
			bg: "gray.100"
		}}>
			<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} {...props} onClick={() => onOpen()} cursor={"pointer"}>
				<Box flex={2}>{bt.tegenRekening ? (<>
					<Text>
						<Tooltip label={friendlyFormatIBAN(bt.tegenRekening.iban)} aria-label={friendlyFormatIBAN(bt.tegenRekening.iban)} placement={"right"} hasArrow={true}>
							<span>{bt.tegenRekening.rekeninghouder}</span>
						</Tooltip>
					</Text>
				</>) :
					<Text whiteSpace={"nowrap"}>{friendlyFormatIBAN(bt.tegenRekeningIban) || t("unknown")}</Text>
				}
				</Box>
				{!isMobile && (
					<Box flex={1}>
						<Badge fontSize={"12px"} fontWeight={"normal"}>{bt.journaalpost?.grootboekrekening.naam}</Badge>
					</Box>
				)}
				<Box flex={0} minWidth={120}>
					<Currency value={bt.bedrag} />
				</Box>
				<Box flex={0} pl={3}>
					<Icon name={bt.journaalpost ? "check-circle" : "question"} color={bt.journaalpost ? "gray.500" : "yellow.500"} />
				</Box>
				{/* Todo: Later uit te breiden met geboekt op specifieke afspraak als deze bekend is */}
			</Stack>
		</PseudoBox>
	</>);
};

export default TransactionItem;