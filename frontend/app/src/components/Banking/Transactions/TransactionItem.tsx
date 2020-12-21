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
import {
	Afspraak,
	BankTransaction,
	Rubriek,
	useCreateJournaalpostAfspraakMutation,
	useCreateJournaalpostGrootboekrekeningMutation,
	useDeleteJournaalpostMutation,
	useGetAllRubriekenAndAfsprakenQuery
} from "../../../generated/graphql";
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

	const [createJournaalpostAfspraak] = useCreateJournaalpostAfspraakMutation();
	const [createJournaalpostGrootboekrekening] = useCreateJournaalpostGrootboekrekeningMutation();
	const [deleteJournaalpost, $deleteJournaalpost] = useDeleteJournaalpostMutation();

	const handleMutation = (mutation: Promise<any>, callback: VoidFunction) => {
		mutation
			.then(() => {
				toast({
					status: "success",
					title: t("messages.journals.createSuccessMessage"),
					position: "top",
				});
				refetch();
				callback();
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

	const onClickDeleteJournaalpost = () => {
		const id = bt.journaalpost?.id;

		if (id) {
			handleMutation(deleteJournaalpost({
				variables: {id}
			}), () => {
				setSelectedRubriek(undefined);
				setSelectedAfspraak(undefined);
			});
		}
	}

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

						{selectedAfspraak && (
							<Stack>
								<Divider />

								<Heading size={"sm"}>{t("booking")}</Heading>
								<Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} spacing={2}>
									<SelectAfspraakOption afspraak={selectedAfspraak} enableHover={false} />
									<Box>
										<IconButton icon={<DeleteIcon />} variant={"ghost"} aria-label={t("actions.disconnect")} onClick={onClickDeleteJournaalpost}
										            isLoading={$deleteJournaalpost.loading} />
									</Box>
								</Stack>
							</Stack>
						)}
						{selectedRubriek && (
							<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
								<Box>
									<Label>{t("forms.agreements.fields.rubriek")}</Label>
									<Box>
										<Text>{selectedRubriek.naam}</Text>
										{selectedRubriek.grootboekrekening && <Text fontSize={"sm"}>{selectedRubriek.grootboekrekening.omschrijving}</Text>}
									</Box>
								</Box>
								<Box>
									<IconButton icon={<DeleteIcon />} variant={"ghost"} aria-label={t("actions.disconnect")} onClick={onClickDeleteJournaalpost}
									            isLoading={$deleteJournaalpost.loading} />
								</Box>
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

									const transactionId = bt?.id;
									const grootboekrekeningId = foundRubriek?.grootboekrekening?.id;

									if(transactionId && grootboekrekeningId){
										handleMutation(createJournaalpostGrootboekrekening({
											variables: {transactionId, grootboekrekeningId}
										}), () => {
											setSelectedRubriek(foundRubriek);
										});
									}
								}

								const onSelectAfspraak = (afspraak: Afspraak) => {
									const transactionId = bt?.id;
									const afspraakId = afspraak.id;

									if(transactionId && afspraakId){
										handleMutation(createJournaalpostAfspraak({
											variables: {transactionId, afspraakId}
										}), () => {
											setSelectedAfspraak(afspraak);
										});
									}
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
													<SelectAfspraak value={selectedAfspraak} options={options.afspraken} onChange={onSelectAfspraak} />
												</TabPanel>
												<TabPanel px={0}>
													<Select onChange={onSelectRubriek} options={options.rubrieken} isClearable={true} noOptionsMessage={() => t("select.noOptions")}
													        maxMenuHeight={200} />
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