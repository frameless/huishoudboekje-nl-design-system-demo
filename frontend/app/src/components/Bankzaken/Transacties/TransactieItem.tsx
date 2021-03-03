import {DeleteIcon, WarningIcon} from "@chakra-ui/icons";
import {
	Box,
	BoxProps,
	Divider,
	Flex,
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
	Table,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Tag,
	TagLabel,
	TagLeftIcon,
	Tbody,
	Text,
	Tooltip,
	useBreakpointValue,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import React, {useContext, useState} from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {
	Afspraak,
	BankTransaction,
	Rubriek,
	useCreateJournaalpostAfspraakMutation,
	useCreateJournaalpostGrootboekrekeningMutation,
	useDeleteJournaalpostMutation,
	useGetTransactionItemFormDataQuery,
} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {formatIBAN} from "../../../utils/things";
import Currency from "../../Currency";
import Label from "../../Layouts/Label";
import PrettyIban from "../../Layouts/PrettyIban";
import SelectAfspraakOption from "../../Layouts/SelectAfspraak/SelectAfspraakOption";
import {TransactionsContext} from "./index";
import TransactieDetailsView from "./TransactieDetailsView";

const TransactieItem: React.FC<BoxProps & {bankTransaction: BankTransaction}> = ({bankTransaction: bt, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const toast = useToast();
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {refetch} = useContext(TransactionsContext);

	const suggesties: Afspraak[] = bt.suggesties || [];

	const [selectedAfspraak, setSelectedAfspraak] = useState<Afspraak | undefined>(bt.journaalpost?.afspraak);
	const [selectedRubriek, setSelectedRubriek] = useState<Rubriek | undefined>(bt.journaalpost?.grootboekrekening?.rubriek);

	const $transactionItemFormData = useGetTransactionItemFormDataQuery({
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
					isClosable: true,
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
					isClosable: true,
				});
			});
	};

	const onClickDeleteJournaalpost = () => {
		const id = bt.journaalpost?.id;

		if (id) {
			handleMutation(deleteJournaalpost({
				variables: {id},
			}), () => {
				setSelectedRubriek(undefined);
				setSelectedAfspraak(undefined);
			});
		}
	};

	const onClick = () => {
		if (!isMobile) {
			onOpen();
		}
	};

	const booking = () => {
		if (selectedAfspraak) {
			return (
				<Stack>
					<Divider />

					<Heading size={"sm"}>{t("booking")}</Heading>
					<Table>
						<Tbody>
							<SelectAfspraakOption afspraak={selectedAfspraak} enableHover={false} onDelete={onClickDeleteJournaalpost} isLoading={$deleteJournaalpost.loading} />
						</Tbody>
					</Table>
				</Stack>
			);
		}
		else if (selectedRubriek) {
			return (
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
			);
		}
		else {
			return (
				<Queryable query={$transactionItemFormData}>{(data: {rubrieken: Rubriek[], afspraken: Afspraak[]}) => {
					const {rubrieken, afspraken} = data;

					const options = {
						suggesties: suggesties,
						afspraken: afspraken.filter(a => {
							// Skip afspraken that are suggesties
							if (suggesties.find(b => b.id === a.id)) {
								return false;
							}

							const tegenRekening = bt.tegenRekening?.iban || bt.tegenRekeningIban;

							// Show all afspraken if there is no tegenRekening
							if (!tegenRekening) {
								return true;
							}

							return a.tegenRekening?.iban?.replaceAll(" ", "") === tegenRekening.replaceAll(" ", "");
						}),
						rubrieken: rubrieken.filter(r => r.grootboekrekening && r.grootboekrekening.id).map((r: Rubriek) => ({
							key: r.id,
							label: r.naam,
							value: r.grootboekrekening!.id,
						})),
					};

					const onSelectRubriek = (val) => {
						const foundRubriek = rubrieken.find(r => r.grootboekrekening?.id === val.value);

						const transactionId = bt?.id;
						const grootboekrekeningId = foundRubriek?.grootboekrekening?.id;

						if (transactionId && grootboekrekeningId) {
							handleMutation(createJournaalpostGrootboekrekening({
								variables: {transactionId, grootboekrekeningId},
							}), () => {
								setSelectedRubriek(foundRubriek);
							});
						}
					};

					const onSelectAfspraak = (afspraak: Afspraak) => {
						const transactionId = bt?.id;
						const afspraakId = afspraak.id;

						if (transactionId && afspraakId) {
							handleMutation(createJournaalpostAfspraak({
								variables: {transactionId, afspraakId},
							}), () => {
								setSelectedAfspraak(afspraak);
							});
						}
					};

					return (
						<Stack>
							<Heading size={"sm"}>{t("transactions.bookingChoose")}</Heading>

							<Tabs align={"end"}>
								<TabList>
									<Tab>Afspraak</Tab>
									<Tab>Rubriek</Tab>
								</TabList>
								<TabPanels>
									<TabPanel px={0}>
										<Stack spacing={2}>
											<Table size={"sm"}>
												<Tbody>
													{options.suggesties.map(a => (
														<SelectAfspraakOption key={a.id} afspraak={a} isSuggestion={options.suggesties.length === 1} onClick={() => {
															// Todo: accept suggestion
															onSelectAfspraak(a);
														}} px={5} />
													))}
													{options.afspraken.map(a => (
														<SelectAfspraakOption key={a.id} afspraak={a} onClick={() => onSelectAfspraak(a)} px={5} />
													))}
												</Tbody>
											</Table>
										</Stack>
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
			);
		}
	};

	return (<>
		<Modal isOpen={!isMobile && isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent width={"100%"} maxWidth={1000}>
				<ModalHeader>{t("forms.banking.sections.journal.title")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing={5}>
						<TransactieDetailsView transaction={bt} />
						{booking()}
					</Stack>
				</ModalBody>
			</ModalContent>
		</Modal>

		<Box px={2} mx={-2} {...!bt.journaalpost && {
			// bg: "red.50"
		}} _hover={{
			bg: "gray.100",
		}}>
			<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} {...props} onClick={onClick} cursor={"pointer"}>
				<Box flex={2}>{bt.tegenRekening ? (
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

	</>);
};

export default TransactieItem;