import {AddIcon, EditIcon, ViewIcon, WarningTwoIcon} from "@chakra-ui/icons";
import {
	Box,
	Button,
	Divider,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Stack,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useBreakpointValue,
	VStack,
} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {AiOutlineTag} from "react-icons/all";
import {NavLink} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Afspraak, GetAfspraakDocument, GetAfsprakenDocument, useAddAfspraakZoektermMutation, useDeleteAfspraakZoektermMutation} from "../../../generated/graphql";
import d from "../../../utils/dayjs";
import {currencyFormat2, formatBurgerName, isAfspraakActive} from "../../../utils/things";
import useScheduleHelper from "../../../utils/useScheduleHelper";
import useToaster from "../../../utils/useToaster";
import zod, {containsZodErrorCode, zoektermValidator} from "../../../utils/zod";
import Page from "../../shared/Page";
import BackButton from "../../shared/BackButton";
import DataItem from "../../shared/DataItem";
import {FormLeft, FormRight} from "../../shared/Forms";
import PrettyIban from "../../shared/PrettyIban";
import Section from "../../shared/Section";
import ZoektermenList from "../ZoektermenList";
import AfspraakDetailMenu from "./AfspraakDetailMenu";

const AfspraakDetailView: React.FC<{afspraak: Afspraak}> = ({afspraak}) => {
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {t} = useTranslation();
	const toast = useToaster();
	const [zoekterm, setZoekterm] = useState<string>();
	const [zoektermTouched, setZoektermTouched] = useState<boolean>(false);
	const scheduleHelper = useScheduleHelper(afspraak.betaalinstructie);
	const [addAfspraakZoekterm] = useAddAfspraakZoektermMutation({
		refetchQueries: [
			{query: GetAfsprakenDocument},
			{query: GetAfspraakDocument, variables: {id: afspraak.id}},
		],
		onCompleted: () => {
			setZoekterm("");
			setZoektermTouched(false);
		},
	});
	const [deleteAfspraakZoekterm] = useDeleteAfspraakZoektermMutation({
		refetchQueries: [
			{query: GetAfsprakenDocument},
			{query: GetAfspraakDocument, variables: {id: afspraak.id}},
		],
	});

	const onDeleteAfspraakZoekterm = (zoekterm: string) => {
		deleteAfspraakZoekterm({
			variables: {
				afspraakId: afspraak.id!,
				zoekterm,
			},
		}).then(result => {
			if (result.data?.deleteAfspraakZoekterm?.ok) {
				toast({success: t("messages.deleteAfspraakZoektermSuccess")});
			}
		});
	};

	const onAddAfspraakZoekterm = async (e) => {
		e.preventDefault();
		setZoektermTouched(true);

		try {
			const validatedZoekterm = zoektermValidator.parse(zoekterm || "");
			const result = await addAfspraakZoekterm({
				variables: {afspraakId: afspraak.id!, zoekterm: validatedZoekterm},
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

	const menu = <AfspraakDetailMenu afspraak={afspraak} />;
	const bedrag = afspraak.credit ? parseFloat(afspraak.bedrag) : (parseFloat(afspraak.bedrag) * -1);
	const zoektermen = afspraak.zoektermen || [];
	const matchingAfspraken = afspraak.matchingAfspraken || [];
	const validThrough = d(afspraak.validThrough, "YYYY-MM-DD");

	return (
		<Page title={t("afspraakDetailView.title")} backButton={<BackButton to={AppRoutes.Burger(afspraak.burger?.id)} />} menu={menu}>
			<Section>
				<Stack direction={["column", "row"]}>
					<FormLeft title={t("afspraakDetailView.section1.title")} helperText={t("afspraakDetailView.section1.helperText")} />
					<FormRight>

						<Stack direction={["column", "row"]}>
							<DataItem label={t("burger")}>
								<HStack>
									<Text>{formatBurgerName(afspraak.burger)}</Text>
									<IconButton as={NavLink} to={AppRoutes.Burger(afspraak.burger?.id)} variant={"ghost"} size={"sm"} icon={
										<ViewIcon />} aria-label={t("global.actions.view")} />
								</HStack>
							</DataItem>
							{afspraak.tegenRekening && (
								<DataItem label={t("afspraken.tegenrekening")}>
									<HStack>
										<Text>{afspraak.tegenRekening.rekeninghouder}</Text>
										{afspraak.afdeling?.organisatie?.id && (
											<IconButton as={NavLink} to={AppRoutes.Organisatie(afspraak.afdeling.organisatie.id)} variant={"ghost"} size={"sm"}
												aria-label={t("global.actions.view")} icon={<ViewIcon />} />
										)}
									</HStack>
									<Text size={"sm"}><PrettyIban iban={afspraak.tegenRekening.iban} /></Text>
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

					</FormRight>
				</Stack>

				<VStack py={3}>
					<Divider />
				</VStack>

				<Stack direction={["column", "row"]}>
					<FormLeft title={t("afspraakDetailView.section2.title")} helperText={t("afspraakDetailView.section2.helperText")} />
					<FormRight>

						<Stack direction={["column", "row"]}>
							<DataItem label={t("afspraken.rubriek")}>{afspraak.rubriek?.naam}</DataItem>
							<DataItem label={t("afspraken.omschrijving")}>{afspraak.omschrijving}</DataItem>
						</Stack>
						<Stack direction={["column", "row"]}>
							<DataItem label={t("afspraken.bedrag")}>
								<Text color={bedrag < 0 ? "red.500" : "currentcolor"}>{currencyFormat2().format(bedrag)}</Text>
							</DataItem>
						</Stack>

					</FormRight>
				</Stack>

				{afspraak.validThrough && (<>
					<VStack py={3}>
						<Divider />
					</VStack>

					<Stack direction={["column", "row"]}>
						<FormLeft />
						<FormRight>
							{isAfspraakActive(afspraak) ? (
								<Text color={"red.500"}>{t("afspraken.willEndOn", {date: validThrough.format("L")})}</Text>
							) : (
								<Text color={"gray.500"}>{t("afspraken.endedOn", {date: validThrough.format("L")})}</Text>
							)}
							<Box>
								<Button as={NavLink} to={AppRoutes.FollowUpAfspraak(afspraak.id)} colorScheme={"primary"} size={"sm"}
									leftIcon={<AddIcon />}>{t("afspraken.planFollowup")}</Button>
							</Box>
						</FormRight>
					</Stack>
				</>)}
			</Section>

			<Section direction={["column", "row"]}>
				<FormLeft title={t("afspraakDetailView.section3.title")} helperText={t("afspraakDetailView.section3.helperText")} />
				<FormRight>

					<Stack>
						{isAfspraakActive(afspraak) ? (
							<form onSubmit={onAddAfspraakZoekterm}>
								<FormControl isInvalid={!zoektermValidator.safeParse(zoekterm).success && zoektermTouched}>
									<Stack>
										<FormLabel>{t("afspraken.zoektermen")}</FormLabel>
										<InputGroup size={"md"}>
											<InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
												<AiOutlineTag />
											</InputLeftElement>
											<Input id="zoektermen" onChange={e => setZoekterm(e.target.value)} value={zoekterm || ""} onFocus={() => setZoektermTouched(true)} onBlur={() => setZoektermTouched(true)} />
											<InputRightElement width={"auto"} pr={1}>
												<Button type={"submit"} size={"sm"} colorScheme={"primary"}>{t("global.actions.add")}</Button>
											</InputRightElement>
										</InputGroup>
									</Stack>
								</FormControl>
							</form>
						) : (
							<FormLabel>{t("afspraken.zoektermen")}</FormLabel>
						)}
						<ZoektermenList zoektermen={zoektermen} onDeleteZoekterm={isAfspraakActive(afspraak) ? (zoekterm: string) => onDeleteAfspraakZoekterm(zoekterm) : undefined} />
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
										const bedrag = a.credit ? parseFloat(a.bedrag) : (parseFloat(a.bedrag) * -1);

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
													<IconButton as={NavLink} to={AppRoutes.ViewAfspraak(a.id)} variant={"ghost"} size={"sm"} icon={
														<ViewIcon />} aria-label={t("global.actions.view")} title={t("global.actions.view")} />
												</Td>
											</Tr>
										);
									})}
								</Tbody>
							</Table>
						</Stack>
					)}
				</FormRight>
			</Section>

			{!afspraak.credit && (
				<Section direction={["column", "row"]}>
					<FormLeft title={t("afspraakDetailView.betaalinstructie.title")} helperText={t("afspraakDetailView.betaalinstructie.helperText")} />
					<FormRight spacing={5}>
						{afspraak.betaalinstructie ? (<>
							<Stack direction={["column", "row"]}>
								<DataItem label={t("afspraken.periodiek")}>
									<Text>{scheduleHelper.toString()}</Text>
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
							</Stack>

							<Box>
								<Button colorScheme={"primary"} size={"sm"} leftIcon={
									<EditIcon />} as={NavLink} to={AppRoutes.AfspraakBetaalinstructie(afspraak.id)}>{t("global.actions.newBetaalinstructie")}</Button>
							</Box>
						</>) : (<>
							<Text>{t("afspraakDetailView.noBetaalinstructie")}</Text>

							<Stack direction={["column", "row"]}>
								<Button colorScheme={"primary"} size={"sm"} leftIcon={<AddIcon />} as={NavLink} to={AppRoutes.AfspraakBetaalinstructie(afspraak.id)}>
									{t("global.actions.add")}
								</Button>
							</Stack>
						</>)}
					</FormRight>
				</Section>
			)}
		</Page>
	);
};

export default AfspraakDetailView;