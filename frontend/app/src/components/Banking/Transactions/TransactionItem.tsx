import {useMutation, useQuery} from "@apollo/client";
import {DeleteIcon} from "@chakra-ui/icons";
import {
	Box,
	BoxProps,
	Button,
	FormLabel,
	IconButton,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Stack,
	Text,
	Tooltip,
	useDisclosure,
	useToast
} from "@chakra-ui/react";
import {friendlyFormatIBAN} from "ibantools";
import React, {useContext} from "react";
import {useInput, useIsMobile, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {IBankTransaction, IRubriek} from "../../../models";
import {CreateJournaalpostGrootboekrekeningMutation, DeleteJournaalpostMutation, UpdateJournaalpostGrootboekrekeningMutation} from "../../../services/graphql/mutations";
import {GetAllRubricsQuery} from "../../../services/graphql/queries";
import Queryable from "../../../utils/Queryable";
import {dateFormat} from "../../../utils/things";
import Currency from "../../Currency";
import {Label} from "../../Forms/FormLeftRight";
import {TransactionsContext} from "./index";

const TransactionItem: React.FC<BoxProps & { bankTransaction: IBankTransaction }> = ({bankTransaction: bt, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useIsMobile();
	const toast = useToast();
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {refetch} = useContext(TransactionsContext);

	const rubric = useInput({
		validate: [Validators.required]
	});

	const $rubrics = useQuery(GetAllRubricsQuery, {
		onCompleted: (data: { rubrieken: IRubriek[] }) => {
			if (bt.journaalpost) {
				rubric.setValue(bt.journaalpost?.grootboekrekening.id);
			}
		}
	});
	const [createJournal] = useMutation(CreateJournaalpostGrootboekrekeningMutation);
	const [updateJournal] = useMutation(UpdateJournaalpostGrootboekrekeningMutation);
	const [deleteJournal] = useMutation(DeleteJournaalpostMutation);

	const onClickSave = async () => {
		if (!rubric.isValid) {
			toast({
				status: "error",
				title: t("messages.agreements.invalidFormMessage"),
				position: "top",
			});
			return;
		}

		let mutation;

		if (!bt.journaalpost) {
			mutation = createJournal({
				variables: {
					transactionId: bt.id,
					grootboekrekeningId: rubric.value
				}
			});
		}
		else {
			mutation = updateJournal({
				variables: {
					id: bt.journaalpost.id,
					grootboekrekeningId: rubric.value
				}
			});
		}

		mutation.then(() => {
			toast({
				status: "success",
				title: t("messages.journals.createSuccessMessage"),
				position: "top",
			});
			refetch();
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
	const onClickDelete = () => {
		if (!bt.journaalpost) {
			return;
		}

		deleteJournal({
			variables: {
				id: bt.journaalpost.id
			}
		}).then(() => {
			toast({
				status: "success",
				title: t("messages.journals.deleteSuccessMessage"),
				position: "top",
			});
			refetch();
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
				<ModalBody>

					<Stack spacing={5}>
						<Box>
							<Label>{t("transactions.beneficiaryAccount")}</Label>
							<Box flex={2}>{bt.tegenRekening ? (
								<Stack spacing={0}>
									<Text>{bt.tegenRekening.rekeninghouder}</Text>
									<Text fontSize={"sm"}>{friendlyFormatIBAN(bt.tegenRekening.iban)}</Text>
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

						<Box>
							<Label>{t("transactions.description")}</Label>
							<Box fontSize={"sm"} p={2} bg={"gray.100"} overflowX={"scroll"}>
								<Text fontFamily={"monospace"} overflowWrap={"break-word"}>{bt.informationToAccountOwner}</Text>
							</Box>
						</Box>

						<Box as={"form"}>
							<FormLabel>{t("banking.rubric")}</FormLabel>
							<Queryable query={$rubrics}>{({rubrieken}) => (
								<Stack direction={"row"}>
									<Select {...rubric.bind} isInvalid={!rubric.isValid}>
										<option value={undefined}>{t("forms.banking.fields.rubricChoose")}</option>
										{rubrieken.map((r: IRubriek) => (
											<option key={r.id} value={r.grootboekrekening.id}>{r.naam}</option>
										))}
									</Select>
									{bt.journaalpost && (
										<IconButton icon={<DeleteIcon />} aria-label={t("actions.delete")} variant={"ghost"} onClick={() => onClickDelete()} />
									)}
								</Stack>
							)}</Queryable>
						</Box>
					</Stack>

				</ModalBody>
				<ModalFooter>
					<Stack direction={"row"}>
						<Button onClick={() => onClose()}>{t("actions.cancel")}</Button>
						<Button colorScheme={"primary"} onClick={() => onClickSave()}>{t("actions.save")}</Button>
					</Stack>
				</ModalFooter>
			</ModalContent>
		</Modal>

		<Box px={2} mx={-2} _hover={{
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
						<Text fontSize={"sm"}>{bt.journaalpost?.grootboekrekening.naam}</Text>
					</Box>
				)}
				<Box flex={0} minWidth={120}>
					<Currency value={bt.bedrag} />
				</Box>
				{/* Todo: Later uit te breiden met geboekt op specifieke afspraak als deze bekend is */}
			</Stack>
		</Box>
	</>);
};

export default TransactionItem;