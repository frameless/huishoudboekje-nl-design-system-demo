import {
	Box,
	BoxProps,
	Button,
	Divider,
	Heading,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
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
import {friendlyFormatIBAN} from "ibantools";
import React, {useContext} from "react";
import {useInput, useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {
	Afspraak,
	BankTransaction,
	Rubriek,
	useCreateJournaalpostGrootboekrekeningMutation,
	useDeleteJournaalpostMutation,
	useGetAllAfsprakenQuery,
	useGetAllRubriekenQuery,
	useUpdateJournaalpostGrootboekrekeningMutation
} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {dateFormat, formatBurgerName} from "../../../utils/things";
import Currency from "../../Currency";
import {Label} from "../../Forms/FormLeftRight";
import {TransactionsContext} from "./index";

const TransactionItem: React.FC<BoxProps & { bankTransaction: BankTransaction }> = ({bankTransaction: bt, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useIsMobile();
	const toast = useToast();
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {refetch} = useContext(TransactionsContext);

	const rubric = useInput();
	const afspraak = useInput<number>();

	const $rubrics = useGetAllRubriekenQuery({
		fetchPolicy: "no-cache",
		onCompleted: () => {
			if (bt.journaalpost?.grootboekrekening?.id) {
				rubric.setValue(bt.journaalpost?.grootboekrekening.id);
			}
		}
	});
	const $afspraken = useGetAllAfsprakenQuery({
		fetchPolicy: "no-cache",
		onCompleted: () => {
			if (bt.journaalpost?.afspraak?.id) {
				afspraak.setValue(bt.journaalpost?.afspraak?.id);
			}
		}
	});
	const [createJournaalpost] = useCreateJournaalpostGrootboekrekeningMutation();
	const [updateJournaalpost] = useUpdateJournaalpostGrootboekrekeningMutation();
	const [deleteJournaalpost] = useDeleteJournaalpostMutation();

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
		if (!bt.journaalpost || !bt.journaalpost.id) {
			mutation = createJournaalpost({
				variables: {
					transactionId: bt.id!, // Todo: fix this ! somehow
					grootboekrekeningId: rubric.value
				}
			});
		}
		else {
			if (!rubric.value) {
				mutation = deleteJournaalpost({
					variables: {
						id: bt.journaalpost.id,
					}
				});
			}
			else {
				mutation = updateJournaalpost({
					variables: {
						id: bt.journaalpost.id,
						grootboekrekeningId: rubric.value
					}
				});
			}
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

	const maybeFormatIBAN = (iban?: string) => iban ? friendlyFormatIBAN(iban) : t("unknown")

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
									<Text fontSize={"sm"}>{maybeFormatIBAN(bt.tegenRekening.iban)}</Text>
								</Stack>
							) : (
								<Text>{maybeFormatIBAN(bt.tegenRekeningIban)}</Text>
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

						<Divider />

						<Heading size={"sm"}>Koppelen met</Heading>

						<Tabs isFitted>
							<TabList>
								<Tab>Afspraak</Tab>
								<Tab>Rubriek</Tab>
							</TabList>
							<TabPanels>
								<TabPanel px={0}>
									<Queryable query={$afspraken}>{({afspraken}) => {
										const options = afspraken.filter(a => a.gebruiker).map((a: Afspraak) => ({
											key: a.id,
											value: a.id,
											label: [
												(a.tegenRekening?.iban || "Onbekende tegenrekening"),
												a.gebruiker ? formatBurgerName(a.gebruiker) : "Onbekende gebruiker",
												a.bedrag
											].join(" - "),
										}));

										return (
											<Stack>
												<Stack>
													{options.map(a => (
														<Box>{a.label}</Box>
													))}
												</Stack>

												<Divider />

												<Select onChange={(val) => afspraak.setValue(val?.value)} defaultValue={options.find(o => o.value === afspraak.value)}
												        options={options} isClearable={true} />
											</Stack>
										);
									}}</Queryable>
								</TabPanel>
								<TabPanel px={0}>
									<Queryable query={$rubrics}>{({rubrieken}) => {
										const options = rubrieken.filter(r => r.grootboekrekening && r.grootboekrekening.id).map((r: Rubriek) => ({
											key: r.id,
											label: r.naam,
											value: r.grootboekrekening!.id
										}));

										return (
											<Select onChange={(val) => rubric.setValue(val?.value)} defaultValue={options.find(o => o.value === rubric.value)} options={options} isClearable={true} />
										);
									}}
									</Queryable>
								</TabPanel>
							</TabPanels>
						</Tabs>
					</Stack>

				</ModalBody>
				<ModalFooter>
					<Stack direction={"row"}>
						<Button onClick={() => onClose()}>{t("actions.cancel")}</Button>
						<Button colorScheme={"primary"} isDisabled={(!bt.journaalpost || !bt.journaalpost.id) && !rubric.value} onClick={() => onClickSave()}>{t("actions.save")}</Button>
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
						<Tooltip label={maybeFormatIBAN(bt.tegenRekening.iban)} aria-label={maybeFormatIBAN(bt.tegenRekening.iban)} placement={"right"} hasArrow={true}>
							<span>{bt.tegenRekening.rekeninghouder}</span>
						</Tooltip>
					</Text>
				</>) :
					<Text whiteSpace={"nowrap"}>{maybeFormatIBAN(bt.tegenRekeningIban)}</Text>
				}
				</Box>
				{!isMobile && (
					<Box flex={1}>
						<Text fontSize={"sm"}>{bt.journaalpost?.grootboekrekening?.rubriek?.naam}</Text>
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