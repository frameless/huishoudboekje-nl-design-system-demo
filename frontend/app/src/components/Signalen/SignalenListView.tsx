import {Badge, Flex, HStack, Stack, Switch, Text} from "@chakra-ui/react";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {AppRoutes} from "../../config/routes";
import {GetSignalenDocument, Signaal, useUpdateSignaalMutation} from "../../generated/graphql";
import d from "../../utils/dayjs";
import {currencyFormat2} from "../../utils/things";
import {useToaster} from "../../utils/useToaster";
import AuditLogLink from "../Gebeurtenissen/AuditLogLink";

const SignalenListView: React.FC<{signalen: Signaal[]}> = ({signalen = []}) => {
	const {t} = useTranslation();
	const toast = useToaster();

	const [updateSignaal] = useUpdateSignaalMutation({
		refetchQueries: [
			{query: GetSignalenDocument},
		],
	});

	if (signalen.length === 0) {
		return (
			<Text>{t("signalen.noResults")}</Text>
		);
	}

	const toggleSignaalActive = (id: string, newActive: boolean) => {
		updateSignaal({
			variables: {
				id,
				input: {
					isActive: newActive,
				},
			},
		}).then((result) => {
			const isActive = result.data?.updateSignaal?.signaal?.isActive;
			if (isActive) {
				toast({success: t("messages.enableSignaalSuccess")});
			}
			else {
				toast({success: t("messages.disableSignaalSuccess")});
			}
		}).catch(err => {
			toast.closeAll();
			toast({error: err.message});
		});
	};

	return (
		<Stack>
			{signalen.map((s) => (
				<HStack justify={"center"} key={s.id}>
					<Stack spacing={1} width={"100%"}>
						<Text>
							<Trans i18nKey={"signalen.contextMessage"} values={{
								afspraak: (s.alarm?.afspraak?.omschrijving),
								bedrag: currencyFormat2(true).format(parseFloat(s.alarm?.afspraak?.bedrag)),
							}} components={{
								strong: <strong />,
								linkAfspraak: <AuditLogLink to={AppRoutes.ViewAfspraak(s.alarm?.afspraak?.id)}>{s.alarm?.afspraak?.omschrijving}</AuditLogLink>,
							}} />
						</Text>
						<Text fontSize={"sm"} color={"gray.500"}>
							{d(s.timeUpdated).format("LL LT")}
						</Text>
					</Stack>
					<Flex justify={"center"}>
						<Badge colorScheme={s.isActive ? "green" : "gray"}>{s.isActive ? t("enabled") : t("disabled")}</Badge>
					</Flex>
					<Flex justify={"center"}>
						<Switch size={"sm"} isChecked={s.isActive} onChange={() => toggleSignaalActive(s.id!, !s.isActive)} />
					</Flex>
				</HStack>
			))}
		</Stack>
	);
};

export default SignalenListView;