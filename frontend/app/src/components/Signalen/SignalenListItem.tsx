import {Badge, Flex, HStack, Stack, Switch, Text} from "@chakra-ui/react";
import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {AppRoutes} from "../../config/routes";
import {GetSignalenDocument, Signaal, useUpdateSignaalMutation} from "../../generated/graphql";
import d from "../../utils/dayjs";
import {currencyFormat2, formatBurgerName} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import AuditLogLink from "../Gebeurtenissen/AuditLogLink";

type SignalenListItemProps = {
	signaal: Signaal
};

const SignalenListItem: React.FC<SignalenListItemProps> = ({signaal}) => {
	const {t} = useTranslation();
	const toast = useToaster();

	const [updateSignaal] = useUpdateSignaalMutation({
		fetchPolicy: 'no-cache',
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

	const createSignaalMessage = (signaal: Signaal) => {
		let TransComponent: JSX.Element;
		let values = {};
		let components = {};

		if (signaal.bedragDifference && signaal.alarm?.afspraak?.omschrijving && signaal.bankTransactions?.[0]) {
			values = {
				afspraakOmschrijving: signaal.alarm?.afspraak?.omschrijving,
				bedragDifference: currencyFormat2(true).format(parseFloat(signaal.bedragDifference)),
				transactieBedrag: currencyFormat2(true).format(parseFloat(signaal.bankTransactions?.[0]?.bedrag)),
				burgerNaam: formatBurgerName(signaal.alarm?.afspraak?.burger),
			};
			components = {
				strong: <strong />,
				linkAfspraak: <AuditLogLink to={AppRoutes.ViewAfspraak(String(signaal.alarm?.afspraak?.id))}>{signaal.alarm?.afspraak?.omschrijving}</AuditLogLink>,
				linkTransactie: <AuditLogLink to={AppRoutes.ViewTransactie(String(signaal.bankTransactions?.[0]?.id))}>{t("transaction")}</AuditLogLink>,
				linkBurger: <AuditLogLink to={AppRoutes.ViewBurger(String(signaal.alarm?.afspraak?.burger?.id))}>{t("burger")}</AuditLogLink>,
			};
			TransComponent = <Trans i18nKey={"signalen.bedragDifferenceMessage"} values={values} components={components} />;
		}
		else if (signaal.bedragDifference && (!signaal.bankTransactions || signaal.bankTransactions?.length === 0)) {
			values = {
				afspraakOmschrijving: signaal.alarm?.afspraak?.omschrijving,
				bedragDifference: currencyFormat2(true).format(parseFloat(signaal.bedragDifference)),
				burgerNaam: formatBurgerName(signaal.alarm?.afspraak?.burger),
			};
			components = {
				strong: <strong />,
				linkAfspraak: <AuditLogLink to={AppRoutes.ViewAfspraak(String(signaal.alarm?.afspraak?.id))}>{signaal.alarm?.afspraak?.omschrijving}</AuditLogLink>,
				linkBurger: <AuditLogLink to={AppRoutes.ViewBurger(String(signaal.alarm?.afspraak?.burger?.id))}>{t("burger")}</AuditLogLink>,
			};
			TransComponent = <Trans i18nKey={"signalen.noTransactionMessage"} values={values} components={components} />;
		}
		else {
			TransComponent = <Trans i18nKey={"signalen.genericSignaal"} />;
		}

		return TransComponent;
	};

	return (
		<HStack justify={"center"}>
			<Stack spacing={1} width={"100%"}>
				<Text {...!signaal.isActive && {
					color: "gray.500",
					textDecoration: "line-through",
				}}>
					{createSignaalMessage(signaal)}
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
