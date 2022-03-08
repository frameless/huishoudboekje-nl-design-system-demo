import {Divider, FormLabel, Stack, Table, Tbody, Text, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {CustomerStatementMessage, GetCsmsDocument, useDeleteCustomerStatementMessageMutation, useGetCsmsQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useToaster from "../../../utils/useToaster";
import {FormLeft, FormRight} from "../../shared/Forms";
import Page from "../../shared/Page";
import {DeprecatedSection} from "../../shared/Section";
import CsmTableRow from "./CsmTableRow";
import CsmUpload from "./CsmUpload";

const CustomerStatementMessages = () => {
	const {t} = useTranslation();
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
			<Queryable query={$customerStatementMessages}>{(data) => {
				/* Sort CSMs so that the newest appears first */
				const csms: CustomerStatementMessage[] = [...data.customerStatementMessages || []].sort((a, b) => a.uploadDate <= b.uploadDate ? 1 : -1);

				return (
					<Stack spacing={5}>
						<DeprecatedSection>
							<Stack direction={["column", "row"]} spacing={5}>
								<FormLeft title={t("forms.bankzaken.sections.customerStatementMessages.title")} helperText={t("forms.bankzaken.sections.customerStatementMessages.helperText")} />
								<FormRight>
									<Stack>
										<CsmUpload />

										<Divider />

										{csms.length === 0 ? (
											<Text>{t("customerStatementMessages.noResults")}</Text>
										) : (
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
									</Stack>
								</FormRight>
							</Stack>
						</DeprecatedSection>
					</Stack>
				);
			}}
			</Queryable>
		</Page>
	);
};

export default CustomerStatementMessages;