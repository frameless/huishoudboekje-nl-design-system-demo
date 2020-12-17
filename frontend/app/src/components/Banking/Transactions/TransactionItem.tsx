import {DeleteIcon} from "@chakra-ui/icons";
import {
	Box,
	BoxProps,
	Divider,
	Heading,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	Tooltip,
	useDisclosure,
	useToast
} from "@chakra-ui/react";
import React, {useContext, useState} from "react";
import {useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Afspraak, BankTransaction, Rubriek, useGetAllRubriekenAndAfsprakenQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {formatIBAN} from "../../../utils/things";
import Currency from "../../Currency";
import {Label} from "../../Forms/FormLeftRight";
import SelectAfspraak from "../../Layouts/SelectAfspraak/SelectAfspraak";
import SelectAfspraakOption from "../../Layouts/SelectAfspraak/SelectAfspraakOption";
import {TransactionsContext} from "./index";
import TransactionDetailsView from "./TransactionDetailsView";

const TransactionItem: React.FC<BoxProps & { bankTransaction: BankTransaction }> = ({bankTransaction: bt, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useIsMobile();
	const toast = useToast();
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {refetch} = useContext(TransactionsContext);

	const [selectedAfspraak, setSelectedAfspraak] = useState<Afspraak | undefined>(bt.journaalpost?.afspraak);
	const [selectedRubriek, setSelectedRubriek] = useState<Rubriek | undefined>(bt.journaalpost?.grootboekrekening?.rubriek);

	const $rubriekenEnAfspraken = useGetAllRubriekenAndAfsprakenQuery({
		fetchPolicy: "no-cache",
	});

	// const [createJournaalpostAfspraak] = useCreateJournaalpostAfspraakMutation();
	// const [createJournaalpostGrootboekrekening] = useCreateJournaalpostGrootboekrekeningMutation();
	// const [deleteJournaalpost] = useDeleteJournaalpostMutation();
	// const onClickSave = async () => {
	// 	// If rubric and afspraak are both invalid or valid. We need only one.
	// 	if ((!rubric.isValid && !afspraak.isValid) || (afspraak.isValid && rubric.isValid)) {
	// 		toast({
	// 			status: "error",
	// 			title: t("messages.agreements.invalidFormMessage"),
	// 			position: "top",
	// 		});
	// 		return;
	// 	}
	//
	// 	let mutation;
	// 	if (bt.journaalpost?.id) {
	// 		mutation = deleteJournaalpost({
	// 			variables: {
	// 				id: bt.journaalpost.id,
	// 			}
	// 		});
	// 	}
	// 	else {
	// 		// Can't link to afspraak and rubric at the same time.
	// 		if (afspraak.isValid) {
	// 			mutation = createJournaalpostAfspraak({
	// 				variables: {
	// 					transactionId: bt.id!, // Todo: fix this ! somehow
	// 					afspraakId: parseInt(afspraak.value),
	// 				}
	// 			});
	// 		}
	// 		else if (rubric.isValid) {
	// 			mutation = createJournaalpostGrootboekrekening({
	// 				variables: {
	// 					transactionId: bt.id!, // Todo: fix this ! somehow
	// 					grootboekrekeningId: rubric.value,
	// 				}
	// 			});
	// 		}
	// 	}
	//
	// 	mutation.then(() => {
	// 		toast({
	// 			status: "success",
	// 			title: t("messages.journals.createSuccessMessage"),
	// 			position: "top",
	// 		});
	// 		refetch();
	// 		onClose();
	// 	}).catch(err => {
	// 		console.error(err);
	// 		toast({
	// 			position: "top",
	// 			status: "error",
	// 			variant: "solid",
	// 			title: t("messages.genericError.title"),
	// 			description: t("messages.genericError.description"),
	// 		});
	// 	});
	// }

	const onClick = () => {
		if (!isMobile) {
			onOpen();
		}
	};

	return (<>
		<Modal isOpen={!isMobile && isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent width={"100%"} maxWidth={1000}>
				<ModalCloseButton />
				<ModalHeader>{t("forms.banking.sections.journal.title")}</ModalHeader>
				<ModalBody>
					<Stack spacing={5}>
						<TransactionDetailsView transaction={bt} />

						<Divider />

						{selectedAfspraak && (
							<Stack>
								<Heading size={"sm"}>{t("booking")}</Heading>
								<Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} spacing={2}>
									<SelectAfspraakOption afspraak={selectedAfspraak} enableHover={false} />
									<Box>
										<IconButton icon={<DeleteIcon />} aria-label={t("actions.disconnect")} onClick={() => setSelectedAfspraak(undefined)} />
									</Box>
								</Stack>
							</Stack>
						)}
						{selectedRubriek && (
							<Stack>
								<Heading size={"sm"}>{t("booking")}</Heading>
								<Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} spacing={2}>
									<Box>
										<Label>{t("rubric")}</Label>
										<Box>
											<Text>{selectedRubriek.naam}</Text>
										</Box>
									</Box>
									<Box>
										<IconButton icon={<DeleteIcon />} aria-label={t("actions.disconnect")} onClick={() => setSelectedRubriek(undefined)} />
									</Box>
								</Stack>
							</Stack>
						)}

						{(!selectedRubriek && !selectedAfspraak) && (
							<Queryable query={$rubriekenEnAfspraken}>{(data: { rubrieken: Rubriek[], afspraken: Afspraak[] }) => {
								const {rubrieken, afspraken} = data;

								const options = {
									afspraken: afspraken.filter(a => {
										// Show all afspraken if there is no tegenRekening
										if (!bt.tegenRekening && !bt.tegenRekeningIban) {
											return true;
										}
										return (
											a.tegenRekening?.iban?.replaceAll(" ", "") === bt.tegenRekening?.iban?.replaceAll(" ", "") ||
											a.tegenRekening?.iban?.replaceAll(" ", "") === bt.tegenRekeningIban?.replaceAll(" ", "")
										);
									}),
									rubrieken: rubrieken.filter(r => r.grootboekrekening && r.grootboekrekening.id).map((r: Rubriek) => ({
										key: r.id,
										label: r.naam,
										value: r.grootboekrekening!.id
									}))
								};

								const onSelectRubriek = (val) => {
									const foundRubriek = rubrieken.find(r => r.grootboekrekening?.id === val.value);
									setSelectedRubriek(foundRubriek);
								}

								return (
									<Stack>
										<Heading size={"sm"}>Koppelen met</Heading>

										<Tabs isFitted>
											<TabList>
												<Tab>Afspraak</Tab>
												<Tab>Rubriek</Tab>
											</TabList>
											<TabPanels>
												<TabPanel px={0}>
													<SelectAfspraak value={selectedAfspraak} options={options.afspraken} onChange={setSelectedAfspraak} />
												</TabPanel>
												<TabPanel px={0}>
													<Select onChange={onSelectRubriek} options={options.rubrieken} isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} />
												</TabPanel>
											</TabPanels>
										</Tabs>
									</Stack>
								);
							}}</Queryable>
						)}
					</Stack>
				</ModalBody>
			</ModalContent>
		</Modal>

		<Box px={2} mx={-2} _hover={{
			bg: "gray.100"
		}}>
			<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} {...props} onClick={onClick} cursor={"pointer"}>
				<Box flex={2}>{bt.tegenRekening ? (
					<Text>
						<Tooltip label={formatIBAN(bt.tegenRekening.iban) || t("unknown")} aria-label={formatIBAN(bt.tegenRekening.iban) || t("unknown")} placement={"right"} hasArrow={true}>
							<span>{bt.tegenRekening.rekeninghouder}</span>
						</Tooltip>
					</Text>
				) : (
					<Text whiteSpace={"nowrap"}>{formatIBAN(bt.tegenRekeningIban) || t("unknown")}</Text>
				)}
				</Box>
				{!isMobile && (
					<Box flex={1}>
						{bt.journaalpost && (
							<Text fontSize={"sm"}>{bt.journaalpost.afspraak?.rubriek?.naam || bt.journaalpost.grootboekrekening?.rubriek?.naam}</Text>
						)}
					</Box>
				)}
				<Box flex={0} minWidth={120}>
					<Currency minWidth={120} value={bt.bedrag} />
				</Box>
			</Stack>
		</Box>

	</>);
};

export default TransactionItem;