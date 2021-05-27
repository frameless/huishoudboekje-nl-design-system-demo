import {AddIcon} from "@chakra-ui/icons";
import {Box, Button, FormLabel, Stack, Table, Tbody, Th, Thead, Tr, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useDeleteCustomerStatementMessageMutation, useGetCsmsQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useToaster from "../../../utils/useToaster";
import DeadEndPage from "../../DeadEndPage";
import {FormLeft, FormRight} from "../../Layouts/Forms";
import Page from "../../Layouts/Page";
import Section from "../../Layouts/Section";
import CsmTableRow from "./CsmTableRow";
import CsmUploadModal from "./CsmUploadModal";

const CustomerStatementMessages = () => {
	const {t} = useTranslation();
	const {isOpen, onClose, onOpen} = useDisclosure();
	const toast = useToaster();

	const $customerStatementMessages = useGetCsmsQuery({
		fetchPolicy: "no-cache",
	});

	const [deleteCustomerStatementMessage] = useDeleteCustomerStatementMessageMutation();

	const onDelete = (id: number) => {
		deleteCustomerStatementMessage({
			variables: {id},
		}).then(() => {
			toast({
				success: t("messages.customerStatementMessages.deleteSuccess"),
			});
			$customerStatementMessages.refetch();
		}).catch(err => {
			console.error(err);
			toast({
				error: err.message,
			});
		});
	};

	return (
		<Page title={t("banking.customerStatementMessages.title")}>
			{isOpen && (
				<CsmUploadModal onClose={() => {
					$customerStatementMessages.refetch();
					onClose();
				}} />
			)}
			<Queryable query={$customerStatementMessages}>{data => {
				/* Sort CSMs so that the newest appears first */
				const csms = [...data.customerStatementMessages].sort((a, b) => a.uploadDate <= b.uploadDate ? 1 : -1);

				if (csms.length === 0) {
					return (
						<DeadEndPage message={t("messages.csms.addHint", {buttonLabel: t("actions.add")})}>
							<Button colorScheme={"primary"} size={"sm"} leftIcon={<AddIcon />}
								onClick={() => onOpen()}>{t("actions.add")}</Button>
						</DeadEndPage>
					);
				}

				return (
					<Stack spacing={5}>
						<Section>
							<Stack direction={["column", "row"]} spacing={5}>
								<FormLeft title={t("forms.banking.sections.customerStatementMessages.title")} helperText={t("forms.banking.sections.customerStatementMessages.detailText")} />
								<FormRight>
									<Box>
										<Button colorScheme={"primary"} size={"sm"} leftIcon={<AddIcon />} onClick={() => onOpen()}>{t("actions.add")}</Button>
									</Box>

									{csms.length > 0 && (
										<Table variant={"noLeftPadding"}>
											<Thead>
												<Tr>
													<Th>
														<FormLabel>{t("forms.banking.sections.customerStatementMessages.filename")}</FormLabel>
													</Th>
													<Th>
														<FormLabel>{t("forms.common.fields.time")}</FormLabel>
													</Th>
													<Th isNumeric>
														<FormLabel>{t("actions.actions")}</FormLabel>
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