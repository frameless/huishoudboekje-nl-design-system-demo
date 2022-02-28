import React from "react";
import {useTranslation} from "react-i18next";
import {useGetSignalenQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {Signaal} from "../Burgers/BurgerDetail/BurgerSignalenView";
import DeadEndPage from "../shared/DeadEndPage";
import Page from "../shared/Page";
import SignalenListView from "./SignalenListView";

const SignalenList = () => {
	const {t} = useTranslation();
	const $signalen = useGetSignalenQuery();

	return (
		<Queryable query={$signalen}>{data => {
			const signalen: Signaal[] = data.signalen || [];

			if (signalen.length === 0) {
				return (
					<DeadEndPage message={t("messages.signalen.noResults")} />
				);
			}

			return (
				<Page title={t("organizations.organizations")}>
					<SignalenListView signalen={signalen} />
				</Page>
			);
		}}
		</Queryable>
	);
};

export default SignalenList;