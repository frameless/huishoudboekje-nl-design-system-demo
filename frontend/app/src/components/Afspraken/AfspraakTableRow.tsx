import {ViewIcon} from "@chakra-ui/icons";
import {Badge, Box, IconButton, Stack, TableRowProps, Td, Text, Tr, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import Routes from "../../config/routes";
import {Afspraak} from "../../generated/graphql";
import {currencyFormat2, intervalString} from "../../utils/things";

const AfspraakTableRow: React.FC<TableRowProps & {afspraak: Afspraak}> = ({afspraak, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);

	const bedrag = afspraak.credit ? parseFloat(afspraak.bedrag) : (parseFloat(afspraak.bedrag) * -1);

	return (
		<Tr {...props}>
			<Td>{afspraak.organisatie?.weergaveNaam || afspraak.tegenRekening?.rekeninghouder || t("unknown")}</Td>
			{!isMobile && (<Td>
				<Text color={"gray.600"}>{afspraak.beschrijving}</Text>
			</Td>)}
			<Td>
				<Stack spacing={1} flex={1} alignItems={"flex-end"}>
					<Box textAlign={"right"} color={bedrag < 0 ? "red.500" : "currentcolor"}>{currencyFormat2().format(bedrag)}</Box>
					<Badge fontSize={"10px"}>{intervalString(afspraak.interval, t)}</Badge>
				</Stack>
			</Td>
			<Td>
				<IconButton as={NavLink} to={Routes.ViewAfspraak(afspraak.id)} variant={"ghost"} size={"sm"} icon={<ViewIcon />} aria-label={t("actions.view")} title={t("actions.view")} />
			</Td>
		</Tr>
	);
};

export default AfspraakTableRow;