import {Box, FormLabel, List, ListIcon, ListItem, Stack, Table, Tbody, Text, Th, Thead, Tr, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {MdCheckCircle} from "react-icons/md";
import {CustomerStatementMessage, GetCsmsDocument, useDeleteCustomerStatementMessageMutation, useGetCsmsQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useToaster from "../../../utils/useToaster";
import AddButton from "../../shared/AddButton";
import {FormLeft, FormRight} from "../../shared/Forms";
import Page from "../../shared/Page";
import Section from "../../shared/Section";
import CsmTableRow from "./CsmTableRow";
import CsmUploadModal from "./CsmUploadModal";

const CustomerStatementMessages = () => {
	const {t} = useTranslation();
	const addCsmModal = useDisclosure();
	const toast = useToaster();

	const $customerStatementMessages = useGetCsmsQuery();
	const [deleteCustomerStatementMessage] = useDeleteCustomerStatementMessageMutation({
		refetchQueries: [
			{query: GetCsmsDocument},
		],
	});

	const onDelete = (id: number) => {
		deleteCustomerStatementMessage({
			variables: {id},
		}).then(() => {
			toast({
				success: t("messages.customerStatementMessages.deleteSuccess"),
			});
		}).catch(err => {
			console.error(err);
			toast({
				error: err.message,
			});
		});
	};

	return (
		<Page title={t("bankzaken.customerStatementMessages.title")}>
			{addCsmModal.isOpen && (
				<CsmUploadModal onClose={() => addCsmModal.onClose()} />
			)}
			<Queryable query={$customerStatementMessages}>{(data) => {
				/* Sort CSMs so that the newest appears first */
				const csms: CustomerStatementMessage[] = [...data.customerStatementMessages || []].sort((a, b) => a.uploadDate <= b.uploadDate ? 1 : -1);

				return (
					<Stack spacing={5}>
						<Section>
							<Stack direction={["column", "row"]} spacing={5}>
								<FormLeft title={t("forms.bankzaken.sections.customerStatementMessages.title")} helperText={t("forms.bankzaken.sections.customerStatementMessages.helperText")}>
									<Text>{t("customerStatementMessages.formats.title")}</Text>
									<List>
										<ListItem> <ListIcon as={MdCheckCircle} color={"green.500"} /> {t("customerStatementMessages.formats.mt940")}</ListItem>
										<ListItem> <ListIcon as={MdCheckCircle} color={"green.500"} /> {t("customerStatementMessages.formats.camt")}</ListItem>
									</List>
								</FormLeft>
								<FormRight>
									<Box>
										<AddButton onClick={() => addCsmModal.onOpen()} />
									</Box>

									{csms.length > 0 && (
										<Table variant={"noLeftPadding"} size={"sm"}>
											<Thead>
												<Tr>
													<Th>
														<FormLabel>{t("forms.bankzaken.sections.customerStatementMessages.filename")}</FormLabel>
													</Th>
													<Th>
														<FormLabel>{t("global.time")}</FormLabel>
													</Th>
													<Th isNumeric />
												</Tr>
											</Thead>
											<Tbody>
												{csms.map(csm => (
													<CsmTableRow key={csm.id} csm={csm} onDelete={onDelete} />
												))}
											</Tbody>
										</Table>
									)}
								</FormRight>
							</Stack>
						</Section>
					</Stack>
				);
			}}
			</Queryable>
		</Page>
	);
};

export default CustomerStatementMessages;