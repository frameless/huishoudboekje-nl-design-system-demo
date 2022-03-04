import {Checkbox, CheckboxGroup, FormControl, FormLabel, Stack} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useGetSignalenQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {ActiveSwitch, Signaal2} from "../Burgers/BurgerDetail/BurgerSignalenView";
import DeadEndPage from "../shared/DeadEndPage";
import {FormLeft, FormRight} from "../shared/Forms";
import Page from "../shared/Page";
import Section from "../shared/Section";
import SignalenListView from "./SignalenListView";

const SignalenList = () => {
	const {t} = useTranslation();
	const $signalen = useGetSignalenQuery();

	const [filter, setFilter] = useState<ActiveSwitch>({active: true, inactive: false});

	return (
		<Queryable query={$signalen}>{data => {
			const signalen: Signaal2[] = data.signalen || [];

			const filteredSignalen: Signaal2[] = [
				...signalen.filter(a => filter.active && a.isActive),
				...signalen.filter(a => filter.inactive && !a.isActive),
			];

			if (signalen.length === 0) {
				return (
					<Page title={t("signalen.signalen")}>
						<DeadEndPage message={t("messages.signalen.noResults")} />
					</Page>
				);
			}

			return (
				<Page title={t("signalen.signalen")}>
					<Section>
						<Stack direction={["column", "row"]}>
							<FormLeft title={t("signalen.title")} helperText={t("signalen.helperText")}>
								{signalen.length > 0 && (
									<FormControl>
										<FormLabel>{t("global.actions.filter")}</FormLabel>
										<CheckboxGroup defaultValue={["active"]} onChange={(val) => {
											setFilter(() => ({
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
								)}
							</FormLeft>
							<FormRight>
								<SignalenListView signalen={filteredSignalen} />
							</FormRight>
						</Stack>
					</Section>
				</Page>
			);
		}}
		</Queryable>
	);
};

export default SignalenList;