import {HStack, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import TwoColumns from "../shared/TwoColumns";

const StatusErrorPage: React.FC<{error: Error}> = ({error}) => {
	const {t} = useTranslation();

	return (
		<TwoColumns>
			<Stack spacing={5}>
				<HStack spacing={5} maxWidth={400} alignItems={"center"}>
					<Text color={"red.600"}>{t("messages.backendError")}</Text>
				</HStack>
				<HStack spacing={5} maxWidth={400} alignItems={"center"}>
					<Text>{error.message}</Text>
				</HStack>
			</Stack>
		</TwoColumns>
	);
};

export default StatusErrorPage;
