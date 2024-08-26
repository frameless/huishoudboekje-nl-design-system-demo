import {Box, FormLabel, HStack, Stack, Switch, Text, VStack} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Burger, GetBurgerDetailsDocument, useGetSaldoQuery, useUpdateBurgerSaldoAlarmMutation} from "../../../generated/graphql";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import {currencyFormat2} from "../../../utils/things";
import d from "../../../utils/dayjs";
import Queryable from "../../../utils/Queryable";
import CitizenOpenPaymentRecordsSaldo from "./CitizenOpenPaymentRecordsSaldo";


const BurgerSaldoView: React.FC<{burger: Burger}> = ({burger}) => {
	const {t} = useTranslation("citizendetails");
	if (typeof burger.id !== "number") {
		return <SectionContainer>
			<Text>Invalid burgerId</Text>
		</SectionContainer>
	}


	const $saldo = useGetSaldoQuery({
		variables: {
			burgers: [burger.id],
			date: d().format("YYYY-MM-DD")
		},
		fetchPolicy: "no-cache"
	})

	const [updateBurger, $updateBurger] = useUpdateBurgerSaldoAlarmMutation({
		refetchQueries: [
			{query: GetBurgerDetailsDocument, variables: {id: burger.id}},
		],
	});
	const [saldoAlarmActive, setSaldoAlarmActive] = useState(burger.saldoAlarm)

	function onChangeCitizenSaldoAlarm() {
		if (burger.id != undefined) {
			setSaldoAlarmActive(!saldoAlarmActive)
			updateBurger({
				variables: {
					id: burger.id,
					saldoAlarm: !burger.saldoAlarm
				},
				fetchPolicy: "no-cache",
				refetchQueries: [{query: GetBurgerDetailsDocument, variables: {id: burger.id}}]
			}).then(value => (
				setSaldoAlarmActive(value.data?.updateBurgerSaldoAlarm?.burger?.saldoAlarm)
			))
		}
	}


	return (
		<Queryable query={$saldo} children={(data) => {
			const saldo: number = +data.saldo.saldo || 0;
			return (
				<SectionContainer>
					<Section data-test="citizen.sectionBalance" title={t("saldo")}>
						<Stack spacing={2} mb={1} direction={["column", "row"]}>
							<Stack direction={["column", "row"]} spacing={1} flex={1}>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("saldo")}</FormLabel>
									<Text data-test="citizen.balance">{` € ${currencyFormat2(false).format(saldo)}`}</Text>
								</Stack>
								<Stack spacing={1} flex={1}>
									<CitizenOpenPaymentRecordsSaldo citizen={burger}></CitizenOpenPaymentRecordsSaldo>
								</Stack>
								<Stack spacing={1} flex={1}>
									<FormLabel>{t("useSaldoAlarm")}</FormLabel>
									<Switch isChecked={saldoAlarmActive} onChange={() => onChangeCitizenSaldoAlarm()} data-test={"citizen.toggleNegativeBalance"}></Switch>
								</Stack>
							</Stack>
						</Stack>
					</Section>
				</SectionContainer>
			)
		}} />
	);
};

export default BurgerSaldoView;
