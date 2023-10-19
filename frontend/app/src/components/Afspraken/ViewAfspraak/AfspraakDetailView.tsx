import {ViewIcon, WarningTwoIcon} from "@chakra-ui/icons";
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Box,
	Button,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Stack,
	Switch,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useBreakpointValue,
	useDisclosure,
	Wrap,
	WrapItem,
} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {AiOutlineTag} from "react-icons/ai";
import {NavLink, useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {
	Afspraak,
	GetAfspraakDocument,
	useAddAfspraakZoektermMutation,
	useCreateAlarmMutation,
	useDeleteAfspraakBetaalinstructieMutation,
	useDeleteAfspraakZoektermMutation,
	useDeleteAlarmMutation,
	useUpdateAlarmMutation,
	useEndAfspraakMutation
} from "../../../generated/graphql";
import d from "../../../utils/dayjs";
import {useFeatureFlag} from "../../../utils/features";
import {currencyFormat2, formatBurgerName, getBurgerHhbId, isAfspraakActive} from "../../../utils/things";
import useScheduleHelper from "../../../utils/useScheduleHelper";
import useToaster from "../../../utils/useToaster";
import zod, {containsZodErrorCode} from "../../../utils/zod";
import useZoektermValidator from "../../../validators/useZoektermValidator";
import AddButton from "../../shared/AddButton";
import BackButton from "../../shared/BackButton";
import DataItem from "../../shared/DataItem";
import DeleteConfirmButton from "../../shared/DeleteConfirmButton";
import Page from "../../shared/Page";
import PrettyIban from "../../shared/PrettyIban";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import ZoektermenList from "../../shared/ZoektermenList";
import AddAlarmModal from "./AddAlarmModal";
import AfspraakDetailMenu from "./AfspraakDetailMenu";
import AfspraakEndModal from "./AfspraakEndModal";
import BurgerContextContainer from "../../Burgers/BurgerContextContainer";

const AfspraakDetailView: React.FC<{afspraak: Afspraak}> = ({afspraak}) => {
	const validator = useZoektermValidator();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {t} = useTranslation();
	const toast = useToaster();
	const navigate = useNavigate();
	const isSignalenEnabled = useFeatureFlag("signalen");
	const addAlarmModal = useDisclosure();
	const [zoekterm, setZoekterm] = useState<string>();
	const [zoektermTouched, setZoektermTouched] = useState<boolean>(false);
	const betaalinstructieSchedule = useScheduleHelper(afspraak.betaalinstructie);
	const alarmSchedule = useScheduleHelper(afspraak.alarm);
	const endModal = useDisclosure();
	const [addAfspraakZoekterm] = useAddAfspraakZoektermMutation({
		refetchQueries: [
			{query: GetAfspraakDocument, variables: {id: afspraak.id}},
		],
		onCompleted: () => {
			setZoekterm("");
			setZoektermTouched(false);
		},
	});

	const [endAfspraakMutation] = useEndAfspraakMutation({
		refetchQueries: [
			{query: GetAfspraakDocument, variables: {id: afspraak.id}},
		],
	});

	const [deleteAfspraakZoekterm] = useDeleteAfspraakZoektermMutation({
		refetchQueries: [
			{query: GetAfspraakDocument, variables: {id: afspraak.id}},
		],
	});
	const [deleteBetaalinstructie] = useDeleteAfspraakBetaalinstructieMutation({
		refetchQueries: [
			{query: GetAfspraakDocument, variables: {id: afspraak.id}},
		],
	});
	const [createAlarm] = useCreateAlarmMutation({
		refetchQueries: [
			{query: GetAfspraakDocument, variables: {id: afspraak.id}},
		],
	});
	const [updateAlarm] = useUpdateAlarmMutation({
		refetchQueries: [
			{query: GetAfspraakDocument, variables: {id: afspraak.id}},
		],
	});
	const [deleteAlarm] = useDeleteAlarmMutation({
		refetchQueries: [
			{query: GetAfspraakDocument, variables: {id: afspraak.id}},
		],
	});

	const onSubmitEndAfspraak = (validThrough: Date) => {
		endAfspraakMutation({
			variables: {
				id: afspraak.id!,
				validThrough: d(validThrough).format("YYYY-MM-DD"),
			},
		}).then(() => {
			toast({
				success: t("endAfspraak.successMessage", {date: d(validThrough).format("L")}),
			});
			endModal.onClose();
		}).catch(err => {
			toast({
				error: err.message,
			});
		});
	};

	const toggleAlarmActive = () => {
		if (!isSignalenEnabled) {
			return;
		}

		if (!afspraak || !afspraak.alarm?.id) {
			return;
		}

		const isActive = !afspraak.alarm?.isActive;

		updateAlarm({
			variables: {
				id: afspraak.alarm.id,
				input: {
					isActive,
				},
			},
		}).then((result) => {
			const isActive = result.data?.updateAlarm?.alarm?.isActive;
			if (isActive) {
				toast({success: t("messages.enableAlarmSuccess")});
			}
			else {
				toast({success: t("messages.disableAlarmSuccess")});
			}
		}).catch(err => {
			toast.closeAll();
			toast({error: err.message});
		});
	};

	const onDeleteBetaalinstructie = () => {
		if (!afspraak?.id) {
			return;
		}

		deleteBetaalinstructie({
			variables: {
				id: afspraak.id,
			},
		}).then(() => {
			toast({success: t("messages.deleteBetaalinstructieSuccess")});
		}).catch(err => {
			toast.closeAll();
			toast({error: err.message});
		});
	};

	const onDeleteAlarm = () => {
		if (!isSignalenEnabled) {
			return;
		}

		if (!afspraak?.alarm?.id) {
			return;
		}

		deleteAlarm({
			variables: {
				id: afspraak.alarm.id,
			},
		}).then(() => {
			toast({success: t("messages.deleteAlarmSuccess")});
		}).catch(err => {
			toast.closeAll();
			toast({error: err.message});
		});
	};

	const onDeleteAfspraakZoekterm = (zoekterm: string) => {
		if (!afspraak?.id) {
			return;
		}

		deleteAfspraakZoekterm({
			variables: {
				afspraakId: afspraak.id,
				zoekterm,
			},
		}).then(result => {
			if (result.data?.deleteAfspraakZoekterm?.ok) {
				toast({success: t("messages.deleteAfspraakZoektermSuccess")});
			}
		});
	};

	const onAddAfspraakZoekterm = async (e) => {
		if (!afspraak?.id) {
			return;
		}

		e.preventDefault();
		setZoektermTouched(true);

		try {
			const validatedZoekterm = validator.parse(zoekterm || "");
			const result = await addAfspraakZoekterm({
				variables: {afspraakId: afspraak.id, zoekterm: validatedZoekterm},
			});

			if (result.data?.addAfspraakZoekterm?.ok) {
				toast({success: t("messages.addAfspraakZoektermSuccess")});
			}
		}
		catch (err) {
			let error = err.message;

			if (err instanceof zod.ZodError) {
				if (containsZodErrorCode(err, [zod.ZodIssueCode.too_small, zod.ZodIssueCode.invalid_type])) {
					error = t("messages.zoektermLengthError");
				}
			}
			else if (error.includes("Zoekterm already in zoektermen")) {
				error = t("messages.zoektermAlreadyExistsError");
			}

			toast.closeAll();
			toast({error});
		}
	};

	const onCreateAlarm = (data) => {
		if (!isSignalenEnabled) {
			return;
		}

		createAlarm({
			variables: {
				input: {
					...data,
				},
			},
		}).then(result => {
			if (result.data?.createAlarm?.ok) {
				toast({
					success: t("messages.addAfspraakAlarmSuccess"),
				});
				addAlarmModal.onClose();
			}
		}).catch(err => {
			toast.closeAll();
			toast({
				error: err.message,
			});
		});
	};

	const bedrag = afspraak.credit ? parseFloat(afspraak.bedrag) : parseFloat(afspraak.bedrag) * -1;
	const zoektermen = afspraak.zoektermen || [];
	const matchingAfspraken = afspraak.matchingAfspraken || [];
	const validThrough = d(afspraak.validThrough, "YYYY-MM-DD");
	const generateZoektermSuggesties = (): string[] => {
		const result: string[] = [];
		if (afspraak.burger?.bsn) {
			result.push(String(afspraak.burger?.bsn));
		}
		if (afspraak.burger?.achternaam) {
			result.push(afspraak.burger.achternaam);
		}
		if (afspraak.burger) {
			const hhbId = getBurgerHhbId(afspraak.burger);
			if (hhbId) {
				result.push(hhbId);
			}
		}
		if (afspraak.omschrijving) {
			result.push(afspraak.omschrijving);
		}
		return result.filter(z => !zoektermen.includes(z));
	};
	const zoektermSuggesties = generateZoektermSuggesties();
	const onClickZoektermSuggestie = z => {
		setZoekterm(z);
	};

	return (
		<Page title={t("afspraakDetailView.title")} backButton={<BackButton to={AppRoutes.ViewBurger(String(afspraak.burger?.id))} />} menu={(
			<AfspraakDetailMenu afspraak={afspraak} />
		)}>
			{isSignalenEnabled && addAlarmModal.isOpen && <AddAlarmModal afspraak={afspraak} onClose={addAlarmModal.onClose} onSubmit={data => onCreateAlarm(data)} />}

			{afspraak.validThrough && (
				<Alert status={"info"} colorScheme={"skyblue"}>
					<AlertIcon />
					<AlertTitle mr={2}>
						{isAfspraakActive(afspraak) ? t("afspraken.willEndOn", {date: validThrough.format("L")}) : t("afspraken.endedOn", {date: validThrough.format("L")})}
					</AlertTitle>
					<AlertDescription>
						<AddButton onClick={() => navigate(AppRoutes.FollowUpAfspraak(String(afspraak.id)))}>
							{t("afspraken.planFollowup")}
						</AddButton>
					</AlertDescription>
				</Alert>
			)}
			<BurgerContextContainer burger={afspraak.burger} showburgericon={true} />
			<SectionContainer>
				<Section title={t("afspraakDetailView.section1.title")} helperText={t("afspraakDetailView.section1.helperText")} left>
					<Stack>
						<Stack direction={["column", "row"]}>
							<DataItem label={t("burger")}>
								<HStack>
									<Text>{formatBurgerName(afspraak.burger)}</Text>
									<IconButton as={NavLink} to={AppRoutes.ViewBurger(String(afspraak.burger?.id))} variant={"ghost"} size={"sm"} icon={<ViewIcon />} aria-label={t("global.actions.view")} />
								</HStack>
							</DataItem>
							{afspraak.tegenRekening && (
								<DataItem label={t("afspraken.tegenrekening")}>
									<HStack>
										<Text>{afspraak.tegenRekening.rekeninghouder}</Text>
										{afspraak.afdeling?.organisatie?.id && (
											<IconButton as={NavLink} to={AppRoutes.Organisatie(String(afspraak.afdeling.organisatie.id))} variant={"ghost"} size={"sm"}
												aria-label={t("global.actions.view")} icon={<ViewIcon />} />
										)}
									</HStack>
									<Text size={"sm"}><PrettyIban iban={afspraak.tegenRekening.iban} fallback={t("unknownIban")} /></Text>
								</DataItem>
							)}
						</Stack>

						{afspraak.postadres && (
							<Stack direction={["column", "row"]}>
								<DataItem label={t("postadres")}>
									<Text>{afspraak.postadres.straatnaam} {afspraak.postadres.huisnummer}</Text>
									<Text>{afspraak.postadres.postcode} {afspraak.postadres.plaatsnaam}</Text>
								</DataItem>
							</Stack>
						)}
					</Stack>
				</Section>
				<Section title={t("afspraakDetailView.section2.title")} helperText={t("afspraakDetailView.section2.helperText")} left>
					<Stack>
						<Stack direction={["column", "row"]}>
							<DataItem label={t("afspraken.rubriek")}>{afspraak.rubriek?.naam}</DataItem>
							<DataItem label={t("afspraken.omschrijving")}>{afspraak.omschrijving}</DataItem>
						</Stack>
						<Stack direction={["column", "row"]}>
							<DataItem label={t("afspraken.bedrag")}>
								<Text color={bedrag < 0 ? "red.500" : "currentcolor"}>{currencyFormat2().format(bedrag)}</Text>
							</DataItem>
						</Stack>
					</Stack>
				</Section>
				<Section title={t("afspraakDetailView.section3.title")} helperText={t("afspraakDetailView.section3.helperText")}>
					<HStack>
						<DataItem label={t("afspraakDetailView.startDate")}>
							<Text>{d(afspraak.validFrom).format("DD-MM-YYYY")}</Text>
						</DataItem>
						<DataItem label={t("afspraakDetailView.endDate")}>
							{afspraak.validThrough !== null ? (
								<Text>{d(afspraak.validThrough).format("DD-MM-YYYY")}</Text>
							) : (
								<>
									{endModal.isOpen && <AfspraakEndModal startDate={afspraak.validFrom} onSubmit={onSubmitEndAfspraak} onClose={endModal.onClose} />}
									<Box>
										<Button width={"auto"} type={"submit"} size={"sm"} colorScheme={"primary"} onClick={endModal.onOpen}>{t("afspraakDetailView.setEndDate")}</Button>
									</Box>
								</>
							)}

						</DataItem>
					</HStack>
				</Section>
			</SectionContainer>

			<SectionContainer>
				<Section title={t("afspraakDetailView.section4.title")} helperText={t("afspraakDetailView.section4.helperText")}>
					<Stack>
						{isAfspraakActive(afspraak) ? (
							<form onSubmit={onAddAfspraakZoekterm}>
								<FormControl isInvalid={!validator.safeParse(zoekterm).success && zoektermTouched}>
									<Stack>
										<FormLabel>{t("afspraken.zoektermen")}</FormLabel>
										{zoektermSuggesties.length > 0 && (
											<Wrap>
												<WrapItem><Text>{t("zoektermSuggesties")}:</Text></WrapItem>
												<ZoektermenList zoektermen={zoektermSuggesties} onClick={(z) => onClickZoektermSuggestie(z)} />
											</Wrap>
										)}
										<InputGroup size={"md"}>
											<InputLeftElement pointerEvents={"none"} color={"gray.300"} fontSize={"1.2em"}>
												<AiOutlineTag />
											</InputLeftElement>
											<Input
											 	autoComplete="no"
												aria-autocomplete="none"
												id={"zoektermen"}
												onChange={e => setZoekterm(e.target.value)}
												value={zoekterm || ""}
												onFocus={() => setZoektermTouched(true)}
												onBlur={() => setZoektermTouched(true)}
											/>
											<InputRightElement width={"auto"} pr={1}>
												<Button type={"submit"} size={"sm"} colorScheme={"primary"}>{t("global.actions.save")}</Button>
											</InputRightElement>
										</InputGroup>
									</Stack>
								</FormControl>
							</form>
						) : (
							<FormLabel>{t("afspraken.zoektermen")}</FormLabel>
						)}
						<ZoektermenList zoektermen={zoektermen} onClickDelete={isAfspraakActive(afspraak) ? (zoekterm: string) => onDeleteAfspraakZoekterm(zoekterm) : undefined} />
					</Stack>

					{zoektermen.length === 0 && (
						<Text>
							{t("messages.automatischBoeken.noZoektermen")}
						</Text>
					)}

					{isAfspraakActive(afspraak) && matchingAfspraken.length > 0 && (
						<Stack spacing={5}>
							<Text color={"red.500"}>
								<WarningTwoIcon mr={1} />
								{t("messages.automatischBoeken.duplicatesFound")}
							</Text>

							<Table size={"sm"} variant={"noLeftPadding"}>
								<Thead>
									<Tr>
										<Th>{t("burger")}</Th>
										{!isMobile && <Th>{t("afspraken.zoektermen")}</Th>}
										<Th textAlign={"right"}>{t("afspraken.bedrag")}</Th>
										<Th />
									</Tr>
								</Thead>
								<Tbody>
									{matchingAfspraken.map((a, i) => {
										const bedrag = a.credit ? parseFloat(a.bedrag) : parseFloat(a.bedrag) * -1;

										return (
											<Tr key={i}>
												<Td>{formatBurgerName(a.burger)}</Td>
												{!isMobile && (<Td>
													<Text color={"gray.600"}>{(a.zoektermen || []).join(", ")}</Text>
												</Td>)}
												<Td>
													<Stack spacing={1} flex={1} alignItems={"flex-end"}>
														<Box textAlign={"right"} color={bedrag < 0 ? "red.500" : "currentcolor"}>{currencyFormat2().format(bedrag)}</Box>
													</Stack>
												</Td>
												<Td>
													<IconButton as={NavLink} to={AppRoutes.ViewAfspraak(String(a.id))} variant={"ghost"} size={"sm"} icon={
														<ViewIcon />} aria-label={t("global.actions.view")} title={t("global.actions.view")} />
												</Td>
											</Tr>
										);
									})}
								</Tbody>
							</Table>
						</Stack>
					)}
				</Section>
			</SectionContainer>

			{!afspraak.credit && (
				<SectionContainer>
					<Section title={t("afspraakDetailView.betaalinstructie.title")} helperText={t("afspraakDetailView.betaalinstructie.helperText")}>
						{afspraak.betaalinstructie ? (
							<Stack>
								<Stack direction={["column", "row"]} align={"center"}>
									<DataItem label={t("afspraken.periodiek")}>
										<Text>{betaalinstructieSchedule.toString()}</Text>
									</DataItem>
									<DataItem label={t("exports.period")}>
										{d(afspraak.betaalinstructie.startDate).isSame(afspraak.betaalinstructie.endDate) ? (
											<Text>{d(afspraak.betaalinstructie.startDate, "YYYY-MM-DD").format("L")}</Text>
										) : (
											<Text>{t("schedule.fromThrough", {
												from: d(afspraak.betaalinstructie.startDate, "YYYY-MM-DD").format("L"),
												through: afspraak.betaalinstructie.endDate ? d(afspraak.betaalinstructie.endDate, "YYYY-MM-DD").format("L") : "∞",
											})}</Text>
										)}
									</DataItem>
									<DeleteConfirmButton onConfirm={() => onDeleteBetaalinstructie()} />
								</Stack>
							</Stack>
						) : (
							<Stack>
								<Text>{t("afspraakDetailView.noBetaalinstructie")}</Text>

								<Box>
									<AddButton onClick={() => navigate(AppRoutes.AfspraakBetaalinstructie(String(afspraak.id)))} />
								</Box>
							</Stack>
						)}
					</Section>
				</SectionContainer>
			)}

			{isSignalenEnabled && (
				<SectionContainer>
					<Section title={t("afspraakDetailView.alarm.title")} helperText={t("afspraakDetailView.alarm.helperText")}>
						{afspraak.alarm ? (
							<Stack>
								<Stack direction={["column", "row"]}>
									<DataItem label={t("periodiekSelector.periodiek")}>
										<HStack>
											<Text>{alarmSchedule.toString()}</Text>
											{afspraak.alarm?.datumMargin && (
												<Text color={"gray.500"} fontSize={"sm"}>+
													{t("afspraak.alarm.datumMargin", {count: afspraak.alarm?.datumMargin})}
												</Text>
											)}
										</HStack>
									</DataItem>
									{afspraak.alarm?.endDate && afspraak.alarm?.startDate !== afspraak.alarm?.endDate && (
										<DataItem label={t("global.period")}>
											<HStack>
												<Text>{t("schedule.fromThrough", {
													from: d(afspraak.alarm?.startDate, "YYYY-MM-DD").format("L"),
													through: d(afspraak.alarm?.endDate, "YYYY-MM-DD").format("L"),
												})}</Text>
											</HStack>
										</DataItem>
									)}
								</Stack>
								{!afspraak.alarm?.endDate && afspraak.alarm?.startDate && (
									<Stack>
										<DataItem label={t("schedule.nextExpected")}>
											<HStack>
												<Text>{d(afspraak.alarm.startDate).format("L")}</Text>
											</HStack>
										</DataItem>
									</Stack>
								)}
								<Stack direction={["column", null, null, "row"]}>
									<DataItem label={t("bedrag")}>
										<HStack>
											<Text>{currencyFormat2().format(afspraak.alarm?.bedrag)}</Text>
											<Text color={"gray.500"} fontSize={"sm"}>+/- {currencyFormat2().format(afspraak.alarm?.bedragMargin)}</Text>
										</HStack>
									</DataItem>
									<DataItem label={t("afspraak.alarm.options")}>
										<HStack>
											<Switch size={"sm"} isChecked={!!afspraak.alarm?.isActive} onChange={() => toggleAlarmActive()} />
											<DeleteConfirmButton onConfirm={() => onDeleteAlarm()} />
										</HStack>
									</DataItem>
								</Stack>
							</Stack>
						) : (
							<Stack>
								<Text>{t("afspraakDetailView.noAlarm")}</Text>
								<Box>
									<AddButton onClick={() => addAlarmModal.onOpen()} />
								</Box>
							</Stack>
						)}
					</Section>
				</SectionContainer>
			)}
		</Page>
	);
};

export default AfspraakDetailView;
