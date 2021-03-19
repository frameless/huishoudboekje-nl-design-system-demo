import {ViewIcon, WarningTwoIcon} from "@chakra-ui/icons";
import {Button, FormControl, HStack, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Stack, Text} from "@chakra-ui/react";
import React, {useContext, useState} from "react";
import {useTranslation} from "react-i18next";
import {AiOutlineTag} from "react-icons/all";
import {NavLink} from "react-router-dom";
import Routes from "../../../config/routes";
import {Afspraak} from "../../../generated/graphql";
import d from "../../../utils/dayjs";
import {currencyFormat2, formatBurgerName, intervalString} from "../../../utils/things";
import BackButton from "../../BackButton";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";
import DataItem from "../../Layouts/DataItem";
import Label from "../../Layouts/Label";
import Page from "../../Layouts/Page";
import PrettyIban from "../../Layouts/PrettyIban";
import Section from "../../Layouts/Section";
import ZoektermenList from "../ZoektermenList";
import AfspraakDetailMenu from "./AfspraakDetailMenu";
import AfspraakDetailContext from "./context";

const AfspraakDetailView: React.FC<{afspraak: Afspraak}> = ({afspraak}) => {
	const {t} = useTranslation();
	const {deleteAfspraak, deleteAfspraakZoekterm, addAfspraakZoekterm} = useContext(AfspraakDetailContext);
	const [zoekterm, setZoekterm] = useState<string>();

	const onAddAfspraakZoekterm = (e) => {
		e.preventDefault();
		addAfspraakZoekterm(zoekterm, () => setZoekterm(""));
	};

	const menu = <AfspraakDetailMenu afspraak={afspraak} onDelete={() => deleteAfspraak(afspraak)} />;
	const bedrag = afspraak.credit ? parseFloat(afspraak.bedrag) : (parseFloat(afspraak.bedrag) * -1);
	const zoektermen = afspraak.zoektermen || [];

	const zoektermenDuplicatesFound = true; // Todo: backend will tell if automatischBoeken is possible (19-03-2021)

	// const generatedSampleOverschrijvingen = generateSampleOverschrijvingen({
	// 	bedrag: afspraak.bedrag,
	// 	startDate: d(afspraak.startDatum).toDate(),
	// 	startDate2: d(afspraak.startDatum).toDate(),
	// 	endDate: d(afspraak.eindDatum).toDate(),
	// 	nTimes: afspraak.aantalBetalingen || 1,
	// 	interval: afspraak.interval || XInterval.empty,
	// });

	return (
		<Page title={t("afspraakDetailView.title")} backButton={<BackButton to={Routes.Burger(afspraak.burger?.id)} />} menu={menu}>
			<Section direction={["column", "row"]}>
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
						{afspraak.organisatie && (
							<DataItem label={t("organisatie")}>
								<HStack>
									<Text>{afspraak.organisatie?.kvkDetails?.naam}</Text>
									<IconButton as={NavLink} to={Routes.Organisatie(afspraak.organisatie?.id)} variant={"ghost"} size={"sm"} icon={
										<ViewIcon />} aria-label={t("actions.view")} />
								</HStack>
							</DataItem>
						)}
					</Stack>
				</FormRight>
			</Section>

			<Section direction={["column", "row"]}>
				<FormLeft title={t("afspraakDetailView.section2.title")} helperText={t("afspraakDetailView.section2.helperText")} />
				<FormRight>
					<Stack direction={["column", "row"]}>
						<DataItem label={t("afspraak.rubriek")}>{afspraak.rubriek?.naam}</DataItem>
						<DataItem label={t("afspraak.omschrijving")}>{afspraak.beschrijving}</DataItem>
					</Stack>
					<Stack direction={["column", "row"]}>
						<DataItem label={t("afspraak.tegenrekening")}>
							<Text>{afspraak.tegenRekening?.rekeninghouder}</Text>
							<Text size={"sm"}><PrettyIban iban={afspraak.tegenRekening?.iban} /></Text>
						</DataItem>
						<DataItem label={t("afspraak.bedrag")}>
							<Text color={bedrag < 0 ? "red.500" : "currentcolor"}>{currencyFormat2().format(bedrag)}</Text>
						</DataItem>
					</Stack>
				</FormRight>
			</Section>

			<Section direction={["column", "row"]}>
				<FormLeft title={t("afspraakDetailView.section3.title")} helperText={t("afspraakDetailView.section3.helperText")} />
				<FormRight>
					<Stack direction={"column"}>
						<form onSubmit={onAddAfspraakZoekterm}>
							<FormControl>
								<Stack>
									<Label>{t("afspraak.zoektermen")}</Label>
									<InputGroup size={"md"}>
										<InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
											<AiOutlineTag />
										</InputLeftElement>
										<Input id="zoektermen" onChange={e => setZoekterm(e.target.value)} value={zoekterm || ""} />
										<InputRightElement width={"auto"} pr={1}>
											<Button type={"submit"} size={"sm"} colorScheme={"primary"}>{t("actions.add")}</Button>
										</InputRightElement>
									</InputGroup>
								</Stack>
							</FormControl>
						</form>
						<ZoektermenList zoektermen={zoektermen} onDeleteZoekterm={(zoekterm: string) => deleteAfspraakZoekterm(zoekterm)} />
					</Stack>
					{zoektermen.length === 0 && (
						<Text color={"red.500"}>
							<WarningTwoIcon mr={1} />
							{t("messages.automatischBoekenDisabled_noZoektermen")}
						</Text>
					)}
					{zoektermenDuplicatesFound && (
						<Text color={"red.500"}>
							<WarningTwoIcon mr={1} />
							{t("messages.automatischBoekenDisabled_duplicatesFound")}
						</Text>
					)}
				</FormRight>
			</Section>

			<Section direction={["column", "row"]}>
				<FormLeft title={t("afspraakDetailView.section4.title")} helperText={t("afspraakDetailView.section4.helperText")} />
				<FormRight>
					<Stack direction={["column", "row"]}>
						<DataItem label={t("afspraak.periodiek")}>{intervalString(afspraak.interval, t)}</DataItem>
						<DataItem label={t("afspraak.periode")}>{t("vanTotDatums", {start: d(afspraak.startDatum).format("L"), end: d(afspraak.eindDatum).format("L")})}</DataItem>
					</Stack>
					<Stack direction={["column", "row"]}>
						<DataItem label={t("afspraak.omschrijving")}>{/* Todo */ "omschrijving"}</DataItem>
					</Stack>
					{/* Todo: show verwachte betalingen (19-03-2021) */}
					{/* <Stack direction={["column", "row"]}>*/}
					{/*	<Box>*/}
					{/*		<Button>Bekijk verwachte betalingen</Button>*/}
					{/*	</Box>*/}
					{/*</Stack>*/}
				</FormRight>
			</Section>

			{/* Todo: show verwachte betalingen (19-03-2021) */}
			{/*<Section direction={["column", "row"]}>*/}
			{/*	<FormLeft title={t("forms.agreements.sections.2.title")} helperText={t("forms.agreements.sections.2.helperText")} />*/}
			{/*	<FormRight>*/}
			{/*		<OverschrijvingenListView overschrijvingen={generatedSampleOverschrijvingen} />*/}
			{/*	</FormRight>*/}
			{/*</Section>*/}
		</Page>
	);
};

export default AfspraakDetailView;