import {AddIcon, ViewIcon, WarningTwoIcon} from "@chakra-ui/icons";
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
import React, {useContext, useState} from "react";
import {useTranslation} from "react-i18next";
import {AiOutlineTag} from "react-icons/all";
import {NavLink} from "react-router-dom";
import Routes from "../../../config/routes";
import {Afspraak, useEndAfspraakMutation} from "../../../generated/graphql";
import d from "../../../utils/dayjs";
import {currencyFormat2, formatBurgerName, isAfspraakActive} from "../../../utils/things";
import useHandleMutation from "../../../utils/useHandleMutation";
import {zoektermValidator} from "../../../utils/zod";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";
import BackButton from "../../Layouts/BackButton";
import DataItem from "../../Layouts/DataItem";
import Page from "../../Layouts/Page";
import PrettyIban from "../../Layouts/PrettyIban";
import Section from "../../Layouts/Section";
import ZoektermenList from "../ZoektermenList";
import AfspraakDetailMenu from "./AfspraakDetailMenu";
import AfspraakDetailContext from "./context";

const AfspraakDetailView: React.FC<{afspraak: Afspraak}> = ({afspraak}) => {
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {t} = useTranslation();
	const {deleteAfspraak, deleteAfspraakZoekterm, addAfspraakZoekterm, refetch} = useContext(AfspraakDetailContext);
	const [zoekterm, setZoekterm] = useState<string>();
	const [zoektermTouched, setZoektermTouched] = useState<boolean>(false);
	const handleMutation = useHandleMutation();

	const onAddAfspraakZoekterm = (e) => {
		e.preventDefault();
		setZoektermTouched(true);
		addAfspraakZoekterm(zoekterm || "", () => {
			setZoekterm("");
			setZoektermTouched(false);
		});
	};

	const [endAfspraakMutation] = useEndAfspraakMutation();
	const endAfspraak = (validThrough: Date) => {
		handleMutation(endAfspraakMutation({
			variables: {
				id: afspraak.id!,
				validThrough: d(validThrough).format("YYYY-MM-DD"),
			},
		}), t("endAfspraak.successMessage", {date: d(validThrough).format("L")}), () => {
			refetch();
		});
	};

	const menu = <AfspraakDetailMenu afspraak={afspraak} onDelete={() => deleteAfspraak()} onEndAfspraak={(validThrough: Date) => endAfspraak(validThrough)} />;
	const bedrag = afspraak.credit ? parseFloat(afspraak.bedrag) : (parseFloat(afspraak.bedrag) * -1);
	const zoektermen = afspraak.zoektermen || [];
	const matchingAfspraken = afspraak.matchingAfspraken || [];
	const validThrough = d(afspraak.validThrough, "YYYY-MM-DD");

	return (
		<Page title={t("afspraakDetailView.title")} backButton={<BackButton to={Routes.Burger(afspraak.burger?.id)} />} menu={menu}>
			<Section>
				<Stack direction={["column", "row"]}>
					<FormLeft title={t("afspraakDetailView.section1.title")} helperText={t("afspraakDetailView.section1.helperText")} />
					<FormRight>

						<Stack direction={["column", "row"]}>
							<DataItem label={t("burger")}>
								<HStack>
									<Text>{formatBurgerName(afspraak.burger)}</Text>
									<IconButton as={NavLink} to={Routes.Burger(afspraak.burger?.id)} variant={"ghost"} size={"sm"} icon={
										<ViewIcon />} aria-label={t("actions.view")} />
								</HStack>
							</DataItem>
							<DataItem label={t("afspraak.tegenrekening")}>
								<HStack>
									<Text>{afspraak.tegenRekening?.rekeninghouder}</Text>
									{afspraak.organisatie?.id && (
										<IconButton as={NavLink} to={Routes.Organisatie(afspraak.organisatie.id)} variant={"ghost"}
											size={"sm"} icon={<ViewIcon />} aria-label={t("actions.view")} />
									)}
								</HStack>
								<Text size={"sm"}><PrettyIban iban={afspraak.tegenRekening?.iban} /></Text>
							</DataItem>
						</Stack>

					</FormRight>
				</Stack>

				<VStack py={3}>
					<Divider />
				</VStack>

				<Stack direction={["column", "row"]}>
					<FormLeft title={t("afspraakDetailView.section2.title")} helperText={t("afspraakDetailView.section2.helperText")} />
					<FormRight>

						<Stack direction={["column", "row"]}>
							<DataItem label={t("afspraak.rubriek")}>{afspraak.rubriek?.naam}</DataItem>
							<DataItem label={t("afspraak.omschrijving")}>{afspraak.omschrijving}</DataItem>
						</Stack>
						<Stack direction={["column", "row"]}>
							<DataItem label={t("afspraak.bedrag")}>
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
								<Text color={"red.500"}>{t("afspraak.willEndOn", {date: validThrough.format("L")})}</Text>
							) : (
								<Text color={"gray.500"}>{t("afspraak.endedOn", {date: validThrough.format("L")})}</Text>
							)}
							<Box>
								<Button as={NavLink} to={Routes.FollowUpAfspraak(afspraak.id)} colorScheme={"primary"} size={"sm"} leftIcon={
									<AddIcon />}>{t("afspraak.planFollowup")}</Button>
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
										<FormLabel>{t("afspraak.zoektermen")}</FormLabel>
										<InputGroup size={"md"}>
											<InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
												<AiOutlineTag />
											</InputLeftElement>
											<Input id="zoektermen" onChange={e => setZoekterm(e.target.value)} value={zoekterm || ""} onFocus={() => setZoektermTouched(true)} onBlur={() => setZoektermTouched(true)} />
											<InputRightElement width={"auto"} pr={1}>
												<Button type={"submit"} size={"sm"} colorScheme={"primary"}>{t("actions.add")}</Button>
											</InputRightElement>
										</InputGroup>
									</Stack>
								</FormControl>
							</form>
						) : (
							<FormLabel>{t("afspraak.zoektermen")}</FormLabel>
						)}
						<ZoektermenList zoektermen={zoektermen} onDeleteZoekterm={isAfspraakActive(afspraak) ? (zoekterm: string) => deleteAfspraakZoekterm(zoekterm) : undefined} />
					</Stack>

					{zoektermen.length === 0 && (
						<Text>
							{t("messages.automatischBoekenDisabled_noZoektermen")}
						</Text>
					)}

					{isAfspraakActive(afspraak) && matchingAfspraken.length > 0 && (
						<Stack spacing={5}>
							<Text color={"red.500"}>
								<WarningTwoIcon mr={1} />
								{t("messages.automatischBoekenDisabled_duplicatesFound")}
							</Text>

							<Table size={"sm"} variant={"noLeftPadding"}>
								<Thead>
									<Tr>
										<Th>{t("burger")}</Th>
										{!isMobile && <Th>{t("afspraak.zoektermen")}</Th>}
										<Th textAlign={"right"}>{t("afspraak.bedrag")}</Th>
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
													<IconButton as={NavLink} to={Routes.ViewAfspraak(a.id)} variant={"ghost"} size={"sm"} icon={
														<ViewIcon />} aria-label={t("actions.view")} title={t("actions.view")} />
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

			{/*{!afspraak.credit && (*/}
			{/*	<Section direction={["column", "row"]}>*/}
			{/*		<FormLeft title={t("afspraakDetailView.betaalinstructie.title")} helperText={t("afspraakDetailView.betaalinstructie.helperText")}>*/}
			{/*			<pre>{JSON.stringify(afspraak.betaalinstructie, null, 2)}</pre>*/}
			{/*		</FormLeft>*/}
			{/*		<FormRight spacing={5}>*/}
			{/*			{afspraak.betaalinstructie ? (<>*/}
			{/*				<Stack direction={["column", "row"]}>*/}
			{/*					<DataItem label={t("afspraak.periodiek")}>*/}
			{/*						<Text>{"INTERVAL" /* TODO *!/</Text>*/}
			{/*					</DataItem>*/}
			{/*					<DataItem label={t("exports.period")}>*/}
			{/*						<Text>{d(afspraak.validFrom, "YYYY-MM-DD").format("L")} - {afspraak.validThrough ? d(afspraak.validThrough, "YYYY-MM-DD").format("L") : "-"}</Text>*/}
			{/*					</DataItem>*/}
			{/*				</Stack>*/}

			{/*				<Box>*/}
			{/*					<Button colorScheme={"primary"} size={"sm"} as={NavLink} to={Routes.AfspraakBetaalinstructie(afspraak.id!)}>*/}
			{/*						{t("actions.edit")}*/}
			{/*					</Button>*/}
			{/*				</Box>*/}
			{/*			</>) : (<>*/}
			{/*				<Text>{t("afspraakDetailView.noBetaalinstructie")}</Text>*/}

			{/*				<Stack direction={["column", "row"]}>*/}
			{/*					<Button colorScheme={"primary"} size={"sm"} leftIcon={<AddIcon />} as={NavLink} to={Routes.AfspraakBetaalinstructie(afspraak.id!)}>*/}
			{/*						{t("actions.add")}*/}
			{/*					</Button>*/}
			{/*				</Stack>*/}
			{/*			</>)}*/}
			{/*		</FormRight>*/}
			{/*	</Section>*/}
			{/*)}*/}
		</Page>
	);
};

export default AfspraakDetailView;