import {WarningIcon} from "@chakra-ui/icons";
import {Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import TwoColumns from "../shared/TwoColumns";
import ServicesStatus from "./ServicesStatus";

const StatusErrorPage = () => {
	const {t} = useTranslation();

	return (
		<TwoColumns>
			<Stack spacing={6}>
				<Stack spacing={5} maxWidth={400} direction={"row"} alignItems={"center"}>
					<WarningIcon color={"red.500"} />
					<Text color={"red.600"}>{t("messages.backendError")}</Text>
				</Stack>

				<Box maxW={400}>
					<Accordion allowToggle>
						<AccordionItem>
							<AccordionButton>
								<Box flex={"1"}>{t("statuspage.title")}</Box>
								<AccordionIcon />
							</AccordionButton>
							<AccordionPanel pb={4}>
								<ServicesStatus />
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
				</Box>
			</Stack>
		</TwoColumns>
	);
};

export default StatusErrorPage;