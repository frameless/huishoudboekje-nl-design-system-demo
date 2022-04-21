import {LazyQueryResult, QueryResult} from "@apollo/client/react/types/types";
import {DownloadIcon, WarningIcon} from "@chakra-ui/icons";
import {Box, Button, Divider, Heading, HStack, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, OrderedList, Spinner, Stack, Text, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import DataItem from "../components/shared/DataItem";
import d from "./dayjs";

const Loading = () => (
	<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
		<Spinner />
	</Stack>
);

type QueryableProps = {
	query: QueryResult | LazyQueryResult<any, any>,
	loading?: JSX.Element | null | boolean,
	error?: JSX.Element | null | boolean,
	options?: {
		hidePreviousResults?: boolean
	},
	children
};

const generateErrorReport = (error: Error, query?: QueryableProps["query"]) => {
	return {
		graphqlQuery: {
			variables: query?.variables ?? null,
			previousData: query?.previousData ?? null,
			data: query?.data ?? null,
			error: {
				message: error.message,
				raw: error,
				stack: error.stack?.split("\n"),
			},
		},
		client: {
			time: {
				readable: d().format("LLLL"),
				raw: d().toJSON(),
			},
			location: window.location.toString(),
			userAgent: navigator.userAgent,
			display: [window.innerWidth, window.innerHeight].join("x"),
		},
	};
};

const QueryableError: React.FC<{error?: Error, query?: QueryableProps["query"]}> = ({error, query}) => {
	const {t} = useTranslation();
	const modal = useDisclosure({
		defaultIsOpen: true,
	});

	const onClickDownloadReportButton = (error) => {
		const errorSummary = generateErrorReport(error, query);

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
						<Text color={"red.500"}>{t("messages.genericError.shortDescription")}</Text>
					</HStack>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing={5}>
						<Stack>
							<Heading size={"sm"}>Wat nu?</Heading>
							<Box>
								<OrderedList spacing={2}>
									<ListItem>
										<Stack>
											<Text>Download een foutrapport door te klikken deze knop:</Text>
											<Box>
												<Button leftIcon={<DownloadIcon />} colorScheme={"primary"} ml={3} onClick={() => onClickDownloadReportButton(error)}>Download foutrapport</Button>
											</Box>
										</Stack>
									</ListItem>
									<ListItem>
										Stuur het foutrapport en de schermafbeelding naar de applicatiebeheerder.
									</ListItem>
								</OrderedList>
							</Box>
						</Stack>

						<Divider />

						<Stack>
							<DataItem label={t("messages.genericError.locationLabel")}>
								<Text>{window.location.toString()}</Text>
							</DataItem>
							<DataItem label={t("messages.genericError.errorMessageLabel")}>
								<Text>{error.message}</Text>
							</DataItem>
							<DataItem label={t("messages.genericError.rawErrorLabel")}>
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

		<Text onClick={() => modal.onOpen()}>{t("messages.genericError.description")}</Text>
	</>);
};

const Queryable: React.FC<QueryableProps> = ({query, loading, error, options = {}, children}) => {
	const {data: _data, loading: _loading, error: _error, previousData} = query;

	if (_loading) {
		if (!options.hidePreviousResults && previousData) {
			return children(previousData);
		}

		return loading !== false ? (loading || <Loading />) : null;
	}

	if (_error) {
		return error !== false ? (error || <QueryableError error={_error} query={query} />) : null;
	}

	return children(_data);
};

export default Queryable;