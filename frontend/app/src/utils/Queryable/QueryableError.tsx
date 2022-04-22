import {DownloadIcon, WarningIcon} from "@chakra-ui/icons";
import {Box, Button, Divider, Heading, HStack, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, OrderedList, Stack, Text, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import DataItem from "../../components/shared/DataItem";
import useAuth from "../useAuth";
import {QueryableProps} from "./Queryable";
import {generateErrorReport} from "./utils";

const QueryableError: React.FC<{error?: Error, query?: QueryableProps["query"]}> = ({error, query}) => {
	const {t} = useTranslation();
	const {user} = useAuth();
	const modal = useDisclosure({
		defaultIsOpen: true,
	});

	const onClickDownloadReportButton = (error) => {
		const errorSummary = generateErrorReport(error, query, user);

		const element = document.createElement("a");
		element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(errorSummary, null, 2)));
		element.setAttribute("download", "huishoudboekje-error-report.txt");
		element.click();
	};

	if (!error) {
		return (
			<Box>{t("messages.genericError.description")}</Box>
		);
	}

	return (<>
		<Modal isOpen={modal.isOpen} onClose={() => modal.onClose()} size={"6xl"} closeOnOverlayClick={false} closeOnEsc={false}>
			<ModalOverlay bg={"blackAlpha.800"} />
			<ModalContent>
				<ModalHeader>
					<HStack>
						<WarningIcon color={"red.500"} />
						<Text color={"red.500"}>{t("errorHandlingPage.shortDescription")}</Text>
					</HStack>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing={5}>
						<Stack>
							<Heading size={"sm"}>{t("errorHandlingPage.userInstructionTitle")}</Heading>
							<Box>
								<OrderedList spacing={2}>
									<ListItem>
										<Stack>
											<Text>{t("messages.genericError.downloadReportInstruction")}</Text>
											<Box>
												<Button leftIcon={<DownloadIcon />} colorScheme={"primary"} ml={3} onClick={() => onClickDownloadReportButton(error)}>{t("messages.genericError.downloadReportButtonLabel")}</Button>
											</Box>
										</Stack>
									</ListItem>
									<ListItem>
										{t("errorHandlingPage.sendReportInstruction")}
									</ListItem>
								</OrderedList>
							</Box>
						</Stack>

						<Divider />

						<Stack>
							<Heading size={"sm"}>{t("errorHandlingPage.technicalInformation")}</Heading>
							<DataItem label={t("errorHandlingPage.locationLabel")}>
								<Text>{window.location.toString()}</Text>
							</DataItem>
							<DataItem label={t("errorHandlingPage.errorMessageLabel")}>
								<Text>{error.message}</Text>
							</DataItem>
							<DataItem label={t("errorHandlingPage.rawErrorLabel")}>
								<Box>
									<pre>{JSON.stringify(error, null, 2)}</pre>
								</Box>
							</DataItem>
						</Stack>
					</Stack>
				</ModalBody>
				<ModalFooter />
			</ModalContent>
		</Modal>

		<Text onClick={() => modal.onOpen()}>{t("errorHandlingPage.description")}</Text>
	</>);
};

export default QueryableError;