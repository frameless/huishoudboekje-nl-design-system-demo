import {ViewIcon} from "@chakra-ui/icons";
import {Badge, Box, IconButton, Stack, TableRowProps, Td, Text, Tr, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {Afspraak} from "../../generated/graphql";
import {currencyFormat2, isAfspraakActive} from "../../utils/things";
import useScheduleHelper from "../../utils/useScheduleHelper";
import PopoverOpenPaymentRecords from "../Burgers/BurgerDetail/Popover/PopoverOpenPaymentRecords";

const AfspraakTableRow: React.FC<TableRowProps & {afspraak: Afspraak, openPaymentRecords?: any[] | undefined}> = ({afspraak, openPaymentRecords, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const bedrag = afspraak.credit ? parseFloat(afspraak.bedrag) : parseFloat(afspraak.bedrag) * -1;
	const isActive = isAfspraakActive(afspraak);
	const betaalinstructieSchedule = useScheduleHelper(afspraak.betaalinstructie).nextScheduled(afspraak.validFrom ?? '', afspraak.validThrough ?? '');

	return (
		<Tr color={!isActive ? "gray.400" : undefined} {...props}>
			<Td>
				{afspraak.afdeling?.organisatie?.naam ? afspraak.afdeling?.organisatie?.naam + " " : ""}
				{afspraak.afdeling?.organisatie?.naam && afspraak.afdeling?.naam && (<Text><small>{afspraak.afdeling?.naam}</small></Text>)}
				{!afspraak.afdeling?.organisatie?.naam && afspraak.tegenRekening?.rekeninghouder ? afspraak.tegenRekening?.rekeninghouder : ""}
				{!afspraak.afdeling?.organisatie?.naam && !afspraak.tegenRekening?.rekeninghouder ? t("unknown") : ""}
			</Td>
			{!isMobile && (<Td verticalAlign={"top"}>
				<Text>{afspraak.omschrijving}</Text>
			</Td>)}
			{!isMobile && (<Td>
				<Text>{betaalinstructieSchedule}</Text>
			</Td>)}
			{!isMobile && (<Td align={"center"} textAlign={"center"}>
				{openPaymentRecords != undefined && openPaymentRecords.length > 0 &&
					<PopoverOpenPaymentRecords paymentrecords={openPaymentRecords} content={
						<Badge alignContent={"center"} padding={1} paddingLeft={2} paddingRight={2} fontSize={"20"} variant='subtle' size={"large"} colorScheme='blue'>
							{openPaymentRecords.length}
						</Badge>} />
				}
			</Td>)}
			<Td verticalAlign={"top"}>
				<Stack spacing={1} flex={1} align={"flex-end"} justify={"center"}>
					<Box textAlign={"right"} color={!isActive ? "gray.400" : bedrag < 0 ? "red.500" : undefined}>{currencyFormat2().format(bedrag)}</Box>
				</Stack>
			</Td>
			<Td verticalAlign={"top"}>
				<IconButton marginTop={"-.33em"} as={NavLink} to={AppRoutes.ViewAfspraak(String(afspraak.id))} variant={"ghost"} size={"sm"} icon={
					<ViewIcon />} aria-label={t("global.actions.view")} title={t("global.actions.view")} />
			</Td>
		</Tr>
	);
};

export default AfspraakTableRow;
