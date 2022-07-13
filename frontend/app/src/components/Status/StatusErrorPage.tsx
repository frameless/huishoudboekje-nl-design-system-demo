import {WarningIcon} from "@chakra-ui/icons";
import {Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import TwoColumns from "../shared/TwoColumns";

const StatusErrorPage = () => {
	const {t} = useTranslation();

	return (
		<TwoColumns>
			<Stack spacing={6}>
				<Stack spacing={5} maxWidth={400} direction={"row"} alignItems={"center"}>
					<WarningIcon color={"red.500"} />
					<Text color={"red.600"}>{t("messages.backendError")}</Text>
				</Stack>
			</Stack>
		</TwoColumns>
	);
};

export default StatusErrorPage;
