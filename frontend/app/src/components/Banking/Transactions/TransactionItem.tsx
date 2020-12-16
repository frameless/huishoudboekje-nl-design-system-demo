import {
	Badge,
	Box,
	BoxProps,
	Button,
	Divider,
	Heading,
	Modal,
	ModalBody,
	ModalCloseButton,
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
	useCreateJournaalpostAfspraakMutation,
	useCreateJournaalpostGrootboekrekeningMutation,
	useDeleteJournaalpostMutation,
	useGetAllAfsprakenQuery,
	useGetAllRubriekenQuery,
} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {dateFormat, formatBurgerName, intervalString} from "../../../utils/things";
import Currency from "../../Currency";
import {Label} from "../../Forms/FormLeftRight";
import {AfspraakDetailView, GrootboekrekeningDetailView} from "../../Layouts/JournaalpostDetails";
import {TransactionsContext} from "./index";

const SingleValue = (props) => <Option {...props} />

const Option = (props) => {
	const {data, innerProps, innerRef} = props;
	const {afspraak: a}: { afspraak: Afspraak } = data;
	const {t} = useTranslation();

	return (
		<Stack direction={"row"} spacing={2} alignItems={"center"} px={5} py={1} width={"100%"} ref={innerRef} {...innerProps} _hover={{
			bg: "gray.100"
		}} {...props.isSelected && {
			bg: "gray.100"
		}}>
			<Box flex={0}>
				<Text>#{a.id}</Text>
			</Box>
			<Box flex={2}>
				<Text>{a.beschrijving}</Text>
				<Stack direction={"row"} spacing={1}>
					{a.rubriek && <Badge colorScheme={"yellow"} fontWeight={"normal"}>{a.rubriek.naam}</Badge>}
					{a.interval && <Badge colorScheme={"yellow"} fontWeight={"normal"}>{intervalString(a.interval, t)}</Badge>}
				</Stack>
			</Box>
			<Box flex={2}>
				<Text>{a.gebruiker ? formatBurgerName(a.gebruiker) : "Onbekende gebruiker"}</Text>
			</Box>
			<Box flex={0}>
				<Currency value={(a.bedrag * (a.credit ? 1 : -1))} />
			</Box>
		</Stack>
	);
}

const TransactionItem: React.FC<BoxProps & { bankTransaction: BankTransaction }> = ({bankTransaction: bt, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useIsMobile();
	const toast = useToast();
	const {isOpen, onOpen, onClose} = useDisclosure();
	const {refetch} = useContext(TransactionsContext);
	const selectComponents = {Option, SingleValue};

	const rubric = useInput({
		validate: [(v) => v.trim().length > 0]
	});
	const afspraak = useInput({
		validate: [(v) => v.trim().length > 0]
	});

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
				afspraak.setValue("" + bt.journaalpost?.afspraak?.id);
			}
		}
	});
	const [createJournaalpostAfspraak] = useCreateJournaalpostAfspraakMutation();
	const [createJournaalpostGrootboekrekening] = useCreateJournaalpostGrootboekrekeningMutation();
	const [deleteJournaalpost] = useDeleteJournaalpostMutation();

	const onClickSave = async () => {
		// If rubric and afspraak are both invalid or valid. We need only one.
		if ((!rubric.isValid && !afspraak.isValid) || (afspraak.isValid && rubric.isValid)) {
			toast({
				status: "error",
				title: t("messages.agreements.invalidFormMessage"),
				position: "top",
			});
			return;
		}

		let mutation;
		if (bt.journaalpost?.id) {
			mutation = deleteJournaalpost({
				variables: {
					id: bt.journaalpost.id,
				}
			});
		}
		else {
			// Can't link to afspraak and rubric at the same time.
			if (afspraak.isValid) {
				mutation = createJournaalpostAfspraak({
					variables: {
						transactionId: bt.id!, // Todo: fix this ! somehow
						afspraakId: parseInt(afspraak.value),
					}
				});
			}
			else if (rubric.isValid) {
				mutation = createJournaalpostGrootboekrekening({
					variables: {
						transactionId: bt.id!, // Todo: fix this ! somehow
						grootboekrekeningId: rubric.value,
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
	const onClick = () => {
		if (!isMobile) {
			onOpen();
		}
	};

	const onSelectAfspraak = (val) => {
		if (val) {
			afspraak.setValue(String(val.value));
			rubric.reset();
		}
	};
	const onSelectRubriek = (val) => {
		if (val) {
			rubric.setValue(val.value);
			afspraak.reset();
		}
	};

	return (<>
		<Modal isOpen={!isMobile && isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent width={"100%"} maxWidth={1200}>
				<ModalCloseButton />
				<ModalHeader>{t("forms.banking.sections.journal.title")}</ModalHeader>
				<ModalBody>

					<Stack spacing={5} justifyContent={"space-between"}>
						<Stack direction={"row"} spacing={5} justifyContent={"space-between"} maxWidth={500}>
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

							<Box>
								<Label>{t("transactions.amount")}</Label>
								<Box>
									<Currency justifyContent={"flex-start"} value={bt.bedrag} />
								</Box>
							</Box>

							<Box>
								<Label>{t("forms.common.fields.date")}</Label>
								<Box>
									<Text>{dateFormat.format(new Date(bt.transactieDatum))}</Text>
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

						{bt.journaalpost ? (
							<Stack spacing={2}>
								<Heading size={"sm"}>{t("booking")}</Heading>
								<Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
									{bt.journaalpost.afspraak && <AfspraakDetailView afspraak={bt.journaalpost.afspraak} />}
									{bt.journaalpost.grootboekrekening && <GrootboekrekeningDetailView grootboekrekening={bt.journaalpost.grootboekrekening} />}
								</Stack>
							</Stack>
						) : (<>
							<Heading size={"sm"}>Koppelen met</Heading>

							<Tabs>
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
												label: a.toString(),
												afspraak: a,
											}));

											/*
												<Stack>
												Suggesties op basis van:
												- Exact hetzelfde bedrag
												- Dezelfde tegenrekening
												- Select is in alles zoeken
												  - Groeperen op gebruiker
												- Hoeveel vergelijkingen met andere afspraken
												</Stack>
												 */
											return (
												// <Stack spacing={2} border={"1px solid #cccccc"} borderRadius={5} p={3}>
												<Select components={selectComponents} onChange={onSelectAfspraak} defaultValue={options.find(o => o.value === afspraak.value)}
												        options={options} isClearable={true}
												        noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} />
												// </Stack>
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
												<Select onChange={onSelectRubriek} defaultValue={options.find(o => o.value === rubric.value)}
												        options={options} isClearable={true}
												        noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} />
											);
										}}
										</Queryable>
									</TabPanel>
								</TabPanels>
							</Tabs>
						</>)}
					</Stack>

				</ModalBody>
				<ModalFooter>
					<Stack direction={"row"}>
						<Button onClick={() => onClose()}>{t("actions.cancel")}</Button>
						{bt.journaalpost ? (
							<Button colorScheme={"red"} onClick={() => onClickSave()}>{t("actions.disconnect")}</Button>
						) : (
							<Button colorScheme={"primary"} isDisabled={!rubric.value && !afspraak.value}
							        onClick={() => onClickSave()}>{t("actions.save")}</Button>
						)}
					</Stack>
				</ModalFooter>
			</ModalContent>
		</Modal>

		<Box px={2} mx={-2} _hover={{
			bg: "gray.100"
		}}>
			<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} {...props} onClick={onClick} cursor={"pointer"}>
				<Box flex={2}>{bt.tegenRekening ? (
					<Text>
						<Tooltip label={maybeFormatIBAN(bt.tegenRekening.iban)} aria-label={maybeFormatIBAN(bt.tegenRekening.iban)} placement={"right"} hasArrow={true}>
							<span>{bt.tegenRekening.rekeninghouder}</span>
						</Tooltip>
					</Text>
				) : (
					<Text whiteSpace={"nowrap"}>{maybeFormatIBAN(bt.tegenRekeningIban)}</Text>
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