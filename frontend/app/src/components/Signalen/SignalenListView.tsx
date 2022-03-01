import {BellIcon, CheckIcon} from "@chakra-ui/icons";
import {Badge, IconButton, Stack, Table, Tbody, Td, Text, Tr} from "@chakra-ui/react";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {AppRoutes} from "../../config/routes";
import d from "../../utils/dayjs";
import {currencyFormat2} from "../../utils/things";
import {useToaster} from "../../utils/useToaster";
import {Signaal2 as Signaal} from "../Burgers/BurgerDetail/BurgerSignalenView";
import AuditLogLink from "../Gebeurtenissen/AuditLogLink";

const SignalenListView: React.FC<{signalen: Signaal[]}> = ({signalen = []}) => {
	const {t} = useTranslation();
	const toast = useToaster();

	if (signalen.length === 0) {
		return (
			<Text>{t("signalen.noResults")}</Text>
		);
	}

	return (
		<Table size={"sm"} variant={"noLeftPadding"}>
			<Tbody>
				{signalen.map((s, i) => (
					<Tr key={i}>
						<Td>
							<Stack spacing={1} width={"100%"}>
								<Text>
									<Trans i18nKey={"signalen.contextMessage"} values={{
										afspraak: (s.alarm?.afspraak?.omschrijving),
										bedrag: currencyFormat2(true).format(parseFloat(s.context?.bedrag)),
									}} components={{
										strong: <strong />,
										linkAfspraak: <AuditLogLink to={AppRoutes.ViewAfspraak(s.alarm?.afspraak?.id)}>{s.alarm?.afspraak?.omschrijving}</AuditLogLink>,
									}} />
								</Text>
								<Text fontSize={"sm"} color={"gray.500"}>
									{d(s.timeCreated).format("LL LT")}
								</Text>
							</Stack>
						</Td>
						<Td textAlign={"center"}>
							<Badge colorScheme={s.isActive ? "green" : "gray"}>{s.isActive ? t("enabled") : t("disabled")}</Badge>
						</Td>
						<Td textAlign={"center"}>
							<IconButton icon={s.isActive ? <CheckIcon /> : <BellIcon />} size={"sm"} aria-label={s.isActive ? t("actions.disable") : t("actions.enable")} onClick={() => {
								toast.closeAll();
								toast({title: "Deze functionaliteit wordt nog ontwikkeld.", status: "info"});
							}} />
						</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};

export default SignalenListView;