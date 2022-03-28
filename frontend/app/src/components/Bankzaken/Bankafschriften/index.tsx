import {FormLabel, Stack, Table, Tbody, Text, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {CustomerStatementMessage, GetCsmsDocument, useDeleteCustomerStatementMessageMutation, useGetCsmsQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useToaster from "../../../utils/useToaster";
import Page from "../../shared/Page";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
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
			<Stack spacing={5}>
				<SectionContainer>
					<Section
						title={t("forms.bankzaken.sections.customerStatementMessages.title")}
						helperText={t("forms.bankzaken.sections.customerStatementMessages.helperText")}
						right={<CsmUpload refetch={() => $customerStatementMessages.refetch()} />}
					>
						<Queryable query={$customerStatementMessages}>{(data) => {
							/* Sort CSMs so that the newest appears first */
							const csms: CustomerStatementMessage[] = [...data.customerStatementMessages || []].sort((a, b) => a.uploadDate <= b.uploadDate ? 1 : -1);

							return (
								<Stack direction={["column", "row"]} spacing={5}>
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
							);
						}}
						</Queryable>
					</Section>
				</SectionContainer>
			</Stack>
		</Page>
	);
};

export default CustomerStatementMessages;