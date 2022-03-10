import {Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Signaal} from "../../generated/graphql";
import SignalenListItem from "./SignalenListItem";

const SignalenListView: React.FC<{signalen: Signaal[]}> = ({signalen = []}) => {
	const {t} = useTranslation();

	if (signalen.length === 0) {
		return (
			<Text>{t("signalen.noResults")}</Text>
		);
	}

	return (
		<Stack>
			{signalen.map((s) => (
				<SignalenListItem signaal={s} />
			))}
		</Stack>
	);
};

export default SignalenListView;