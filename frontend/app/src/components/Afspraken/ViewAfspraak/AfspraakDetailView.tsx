import {AddIcon, ViewIcon, WarningTwoIcon} from "@chakra-ui/icons";
import {Button, Divider, FormControl, FormLabel, HStack, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Stack, Text, VStack} from "@chakra-ui/react";
import React, {useContext, useState} from "react";
import {useTranslation} from "react-i18next";
import {AiOutlineTag} from "react-icons/all";
import {NavLink} from "react-router-dom";
import Routes from "../../../config/routes";
import {Afspraak} from "../../../generated/graphql";
import {currencyFormat2, formatBurgerName} from "../../../utils/things";
import {zoektermValidator} from "../../../utils/zod";
import BackButton from "../../BackButton";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";
import DataItem from "../../Layouts/DataItem";
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
	const [zoektermTouched, setZoektermTouched] = useState<boolean>(false);

	const onAddAfspraakZoekterm = (e) => {
		e.preventDefault();
		setZoektermTouched(true);
		addAfspraakZoekterm(zoekterm || "", () => {
			setZoekterm("");
			setZoektermTouched(false);
		});
	};

	const menu = <AfspraakDetailMenu afspraak={afspraak} onDelete={() => deleteAfspraak()} />;
	const bedrag = afspraak.credit ? parseFloat(afspraak.bedrag) : (parseFloat(afspraak.bedrag) * -1);
	const zoektermen = afspraak.zoektermen || [];
	const zoektermenDuplicatesFound = true; // Todo: backend will tell if automatischBoeken is possible (19-03-2021)

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
			</Section>

			<Section direction={["column", "row"]}>
				<FormLeft title={t("afspraakDetailView.section3.title")} helperText={t("afspraakDetailView.section3.helperText")} />
				<FormRight>

					<Stack direction={"column"}>
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
				{afspraak.credit ? (
					<FormRight justify={"center"}>
						<Text>{t("afspraakDetailView.noBetaalinstructiePossible")}</Text>
					</FormRight>
				) : (
					<FormRight spacing={5}>
						<Text>{t("afspraakDetailView.noBetaalinstructie")}</Text>

						<Stack direction={["column", "row"]}>
							<Button colorScheme={"primary"} size={"sm"} leftIcon={<AddIcon />} as={NavLink} to={Routes.AfspraakBetaalinstructie(afspraak.id!)}>
								{t("actions.add")}
							</Button>
						</Stack>

						{/* Todo: show verwachte betalingen? (19-03-2021) */}
						{/* <Stack direction={["column", "row"]}>*/}
						{/*	<Box>*/}
						{/*		<Button>Bekijk verwachte betalingen</Button>*/}
						{/*	</Box>*/}
						{/*	<OverschrijvingenListView overschrijvingen={generatedSampleOverschrijvingen} />*/}
						{/*</Stack>*/}
					</FormRight>
				)}
			</Section>
		</Page>
	);
};

export default AfspraakDetailView;