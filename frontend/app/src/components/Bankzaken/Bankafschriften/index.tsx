import {FormLabel, Stack, Table, Tbody, Text, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {CsmData, GetCsmsPagedDocument, useDeleteCustomerStatementMessageMutation, useGetCsmsPagedQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useToaster from "../../../utils/useToaster";
import Page from "../../shared/Page";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import CsmTableRow from "./CsmTableRow";
import CsmUpload from "./CsmUpload";
import usePagination from "../../../utils/usePagination";
import CsmTableLoading from "./CsmTableLoading";

const CustomerStatementMessages = () => {
	const {t} = useTranslation();
	const toast = useToaster();
	const {setTotal, pageSize, offset, PaginationButtons} = usePagination({
		pageSize: 25,
	});

	const $customerStatementMessages = useGetCsmsPagedQuery({
		variables: {
			input: {
				page: {
					skip: offset <= 1 ? 0 : offset,
					take: pageSize
				}
			}
		}
	});
	const [deleteCustomerStatementMessage] = useDeleteCustomerStatementMessageMutation({
		refetchQueries: [
			{query: GetCsmsPagedDocument, variables: {
				input: {
					page: {
						skip: offset <= 1 ? 0 : offset,
						take: pageSize
					}
				}
			}},
		],
	});

	const onDelete = (id: string) => {
		deleteCustomerStatementMessage({
			variables: {input: {
				id: id
			}},
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
	}

	return (
		<Page title={t("bankzaken.customerStatementMessages.title")} >
			<Stack spacing={5}>
				<SectionContainer>
					<Section>
						<CsmUpload refetch={() => $customerStatementMessages.refetch()} />
					</Section>
				</SectionContainer>
				<SectionContainer>
					<Section>
						<Queryable query={$customerStatementMessages} loading={<CsmTableLoading/>} >{(data) => {
							/* Sort CSMs so that the newest appears first */
							const csms: CsmData[] = [...data.CSM_GetPaged.data || []].sort((a, b) => a.file.uploadedAt <= b.file.uploadedAt ? 1 : -1);
							setTotal(data.CSM_GetPaged.PageInfo.total_count)
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
														<FormLabel>{t("forms.bankzaken.sections.customerStatementMessages.transactionCount")}</FormLabel>
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
					<PaginationButtons />
					</Section>
				</SectionContainer>
			</Stack>
		</Page>
	);
};

export default CustomerStatementMessages;
