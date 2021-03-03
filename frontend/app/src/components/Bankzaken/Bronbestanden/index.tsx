import {AddIcon} from "@chakra-ui/icons";
import {Box, Button, Divider, Input, Stack} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useTranslation} from "react-i18next";
import {CustomerStatementMessage, useCreateCustomerStatementMessageMutation, useGetAllCsmsQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import useToaster from "../../../utils/useToaster";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";
import Section from "../../Layouts/Section";
import CsmListView from "./CsmListView";

const CustomerStatementMessages = () => {
	const {t} = useTranslation();
	const toast = useToaster();
	const fileUploadInput = useRef<HTMLInputElement>(null);

	const $customerStatementMessages = useGetAllCsmsQuery({
		fetchPolicy: "no-cache",
	});
	const [createCSM, $createCSM] = useCreateCustomerStatementMessageMutation({
		context: {
			method: "fileUpload",
		},
	});

	const onChangeFile = (e: React.FormEvent<HTMLInputElement>) => {
		const {currentTarget: {files}} = e;

		if (files && files.length > 0) {
			createCSM({
				variables: {
					file: files[0],
				},
			}).then(() => {
				toast({
					success: t("messages.customerStatementMessages.createSuccess"),
				});
				$customerStatementMessages.refetch();
			}).catch(err => {
				console.error(err);

				let errorMessage = err.message;
				if (err.message.includes("Incorrect file")) {
					errorMessage = t("messages.customerStatementMessages.incorrectFileError");
				}

				toast({
					error: errorMessage,
				});
			});

		}
	};

	return (
		<Stack spacing={5}>
			<Section>
				<Stack direction={["column", "row"]} spacing={5}>
					<FormLeft title={t("forms.banking.sections.customerStatementMessages.title")} helperText={t("forms.banking.sections.customerStatementMessages.detailText")} />
					<FormRight>
						<Stack spacing={5}>
							<Input type={"file"} id={"fileUpload"} onChange={onChangeFile} hidden={true} ref={fileUploadInput} />
							<Box>
								<Button colorScheme={"primary"} size={"sm"} leftIcon={<AddIcon />} isLoading={$createCSM.loading}
									onClick={() => fileUploadInput.current?.click()}>{t("actions.add")}</Button>
							</Box>
						</Stack>

						<Divider />

						<Queryable query={$customerStatementMessages}>{(data: {customerStatementMessages: CustomerStatementMessage[]}) => {
							/* Sort CSMs so that the newest appears first */
							const csms = [...data.customerStatementMessages].sort((a, b) => a.uploadDate <= b.uploadDate ? 1 : -1);
							return (<CsmListView csms={csms} refresh={$customerStatementMessages.refetch} />);
						}}
						</Queryable>
					</FormRight>
				</Stack>
			</Section>
		</Stack>
	);
};

export default CustomerStatementMessages;