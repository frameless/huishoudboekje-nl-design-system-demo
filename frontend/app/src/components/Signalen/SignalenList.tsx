import {Checkbox, CheckboxGroup, FormControl, FormLabel, Stack} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Burger, Signaal, useGetSignalenAndBurgersQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {formatBurgerName, useReactSelectStyles} from "../../utils/things";
import {ActiveSwitch} from "../Burgers/BurgerDetail/BurgerSignalenView";
import Page from "../shared/Page";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import SignalenListView from "./SignalenListView";

const SignalenList = () => {
	const {t} = useTranslation();
	const $signalen = useGetSignalenAndBurgersQuery({fetchPolicy: "no-cache"});
	const reactSelectStyles = useReactSelectStyles();
	const [filterByState, setFilterByState] = useState<ActiveSwitch>({active: true, inactive: false});
	const [filterByBurgers, setFilterByBurgers] = useState<number[]>([]);

	return (
		<Queryable query={$signalen} children={(data) => {
			const signalen: Signaal[] = data.signalen ?? [];
			const burgers: Burger[] = data.burgers ?? [];

			const burgerSelectOptions = burgers.map(b => ({
				key: b.id,
				value: b.id,
				label: formatBurgerName(b),
			}));

			const filteredSignalen: Signaal[] = signalen
				.filter(s => { // Filter by burgers
					if (filterByBurgers.length === 0) {
						return true;
					}

					const burgerId = s.alarm?.afspraak?.burgerId;
					if (burgerId) {
						return filterByBurgers.includes(burgerId);
					}

					return false;
				})
				.filter(s => { // Filter by status
					if (s.isActive && filterByState.active) {
						return true;
					}
					else if (!s.isActive && filterByState.inactive) {
						return true;
					}

					return false;
				});
			filteredSignalen.forEach(singaal => {
				if(singaal.alarm?.afspraak){
					singaal.alarm.afspraak.burger = burgers.find(burger => burger.id === singaal.alarm?.afspraak?.burgerId)
				}
			});

			return (
				<Page title={t("signalen.signalen")}>
					<SectionContainer>
						<Section title={t("signalen.title")} helperText={t("signalen.helperText")} left={signalen.length > 0 && (
							<Stack>
								<FormControl>
									<FormLabel>{t("signalen.filterByStatus")}</FormLabel>
									<CheckboxGroup defaultValue={["active"]} onChange={(val) => {
										setFilterByState(() => ({
											active: val.includes("active"),
											inactive: val.includes("inactive"),
										}));
									}}>
										<Stack>
											<Checkbox value={"active"}>{t("signalen.showActive")}</Checkbox>
											<Checkbox value={"inactive"}>{t("signalen.showInActive")}</Checkbox>
										</Stack>
									</CheckboxGroup>
								</FormControl>

								<FormControl>
									<FormLabel>{t("signalen.filterByBurger")}</FormLabel>
									<Select
										id={"rubriek"}
										isClearable={true}
										noOptionsMessage={() => t("signalen.selectNoOptionsMessage")}
										placeholder={t("select.placeholder")}
										maxMenuHeight={350}
										options={burgerSelectOptions}
										isMulti={true}
										// value={form.rubriekId ? rubriekOptions.find(r => r.value === form.rubriekId) : null}
										styles={reactSelectStyles.default}
										onChange={(result) => {
											if (result) {
												const burgerIds: number[] = result.map(r => r.value) as number[];
												setFilterByBurgers(burgerIds);
											}
										}}
									/>
								</FormControl>
							</Stack>
						)}>
							<SignalenListView signalen={filteredSignalen} />
						</Section>
					</SectionContainer>
				</Page>
			);
		}} />
	);
};

export default SignalenList;