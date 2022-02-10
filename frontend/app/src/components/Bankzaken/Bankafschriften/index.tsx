import {Box, FormLabel, Stack, Table, Tbody, Th, Thead, Tr, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {CustomerStatementMessage, GetCsmsDocument, useDeleteCustomerStatementMessageMutation, useGetCsmsQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useToaster from "../../../utils/useToaster";
import Page from "../../shared/Page";
import AddButton from "../../shared/AddButton";
import DeadEndPage from "../../shared/DeadEndPage";
import {FormLeft, FormRight} from "../../shared/Forms";
import Section from "../../shared/Section";
import CsmTableRow from "./CsmTableRow";
import CsmUploadModal from "./CsmUploadModal";

const CustomerStatementMessages = () => {
	const {t} = useTranslation();
	const {isOpen, onClose, onOpen} = useDisclosure();
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
			{isOpen && (
				<CsmUploadModal onClose={() => onClose()} />
			)}
			<Queryable query={$customerStatementMessages}>{(data) => {
				/* Sort CSMs so that the newest appears first */
				const csms: CustomerStatementMessage[] = [...data.customerStatementMessages || []].sort((a, b) => a.uploadDate <= b.uploadDate ? 1 : -1);

				if (csms.length === 0) {
					return (
						<DeadEndPage message={t("messages.csms.addHint", {buttonLabel: t("global.actions.add")})}>
							<AddButton onClick={() => onOpen()} />
						</DeadEndPage>
					);
				}

				return (
					<Stack spacing={5}>
						<Section>
							<Stack direction={["column", "row"]} spacing={5}>
								<FormLeft title={t("forms.bankzaken.sections.customerStatementMessages.title")} helperText={t("forms.bankzaken.sections.customerStatementMessages.detailText")} />
								<FormRight>
									<Box>
										<AddButton onClick={() => onOpen()} />
									</Box>

									{csms.length > 0 && (
										<Table variant={"noLeftPadding"}>
											<Thead>
												<Tr>
													<Th>
														<FormLabel>{t("forms.bankzaken.sections.customerStatementMessages.filename")}</FormLabel>
													</Th>
													<Th>
														<FormLabel>{t("global.time")}</FormLabel>
													</Th>
													<Th isNumeric>
														<FormLabel>{t("global.actions.actions")}</FormLabel>
													</Th>
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