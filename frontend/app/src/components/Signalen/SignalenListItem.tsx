import {Badge, Flex, HStack, Stack, Switch, Text} from "@chakra-ui/react";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {AppRoutes} from "../../config/routes";
import {GetSignalenDocument, Signaal, useUpdateSignaalMutation} from "../../generated/graphql";
import d from "../../utils/dayjs";
import {currencyFormat2} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import AuditLogLink from "../Gebeurtenissen/AuditLogLink";

type SignalenListItemProps = {
	signaal: Signaal
};

const SignalenListItem: React.FC<SignalenListItemProps> = ({signaal}) => {
	const {t} = useTranslation();
	const toast = useToaster();

	const [updateSignaal] = useUpdateSignaalMutation({
		refetchQueries: [
			{query: GetSignalenDocument},
		],
	});

	const toggleSignaalActive = (signaal: Signaal) => {
		updateSignaal({
			variables: {
				id: signaal.id!,
				input: {
					isActive: !signaal.isActive,
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
		<HStack justify={"center"} key={signaal.id}>
			<Stack spacing={1} width={"100%"}>
				<Text {...!signaal.isActive && {
					color: "gray.500",
					textDecoration: "line-through",
				}}>
					<Trans i18nKey={"signalen.contextMessage"} values={{
						afspraak: (signaal.alarm?.afspraak?.omschrijving),
						bedrag: currencyFormat2(true).format(parseFloat(signaal.alarm?.afspraak?.bedrag)),
					}} components={{
						strong: <strong />,
						linkAfspraak: <AuditLogLink to={AppRoutes.ViewAfspraak(signaal.alarm?.afspraak?.id)}>{signaal.alarm?.afspraak?.omschrijving}</AuditLogLink>,
					}} />
				</Text>
				<Text fontSize={"sm"} color={"gray.500"}>
					{d(signaal.timeUpdated).format("LL LT")}
				</Text>
			</Stack>
			<Flex justify={"center"}>
				<Badge colorScheme={signaal.isActive ? "green" : "gray"}>{signaal.isActive ? t("enabled") : t("disabled")}</Badge>
			</Flex>
			<Flex justify={"center"}>
				<Switch size={"sm"} isChecked={signaal.isActive} onChange={() => toggleSignaalActive(signaal)} />
			</Flex>
		</HStack>
	);
};

export default SignalenListItem;