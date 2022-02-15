import React from "react";
import {Signal} from "../../generated/graphql";
import {Table, Tbody, Td, Text, Th, Thead, Tr} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import {GoPrimitiveDot} from "react-icons/all";

const SignalenList: React.FC<{ signalen: Signal[] }> = ({signalen}) => {
	const {t} = useTranslation();

	return (
		<Table size={"sm"} variant={"noLeftPadding"}>
			<Thead>
				<Tr>
					<Th>{t("signalen.status")}</Th>
					<Th>{t("signalen.context")}</Th>
				</Tr>
			</Thead>
			<Tbody>
				{signalen.map((s, i) => (
					<Tr>
						<Td textAlign={"right"}>
							<GoPrimitiveDot color={s.isActive ? "green" : "red"} size="25" />
						</Td>
						<Td>
							<Text>{t("signalen.contextMessage", {
								omschrijving: (s.alarm?.afspraak?.omschrijving),
								bedrag: "100.00",
								datum: "20-09-2022"
							})}</Text>
						</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	)
};

export default SignalenList;