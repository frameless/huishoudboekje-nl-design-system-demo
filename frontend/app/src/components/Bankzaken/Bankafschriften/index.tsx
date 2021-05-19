import {AddIcon} from "@chakra-ui/icons";
import {Box, Button, Divider, Input, Stack} from "@chakra-ui/react";
import React, {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {CustomerStatementMessage, useCreateCustomerStatementMessageMutation, useGetCsmsQuery} from "../../../generated/graphql";
import {useFeatureFlag} from "../../../utils/features";
import Queryable from "../../../utils/Queryable";
import useToaster from "../../../utils/useToaster";
import {FormLeft, FormRight} from "../../Layouts/Forms";
import Section from "../../Layouts/Section";
import CsmListView from "./CsmListView";

const CustomerStatementMessages = () => {
	const {t} = useTranslation();
	const toast = useToaster();
	const batchBankAfschriftenEnabled = useFeatureFlag("batch-bankafschriften");
	const fileUploadInput = useRef<HTMLInputElement>(null);
	const [busy, setBusy] = useState<boolean>(false);

	const $customerStatementMessages = useGetCsmsQuery({
		fetchPolicy: "no-cache",
	});
	const [createCSM, $createCSM] = useCreateCustomerStatementMessageMutation({
		context: {
			method: "fileUpload",
		},
		onCompleted: (options) => {
			console.info("Done uploading", options.createCustomerStatementMessage?.customerStatementMessage?.filename);
		},
	});

	const generateFileUpload = function* (files: FileList): Generator<Promise<unknown>> {
		for (let i = 0; i < files.length; i++) {
			yield new Promise(resolve => {
				createCSM({
					variables: {file: files[i]},
				}).then(result => {
					// Wait for the backend to finish
					setTimeout(() => resolve(result), 5000);
				});
			});
		}
	};

	const onChangeFile = async (e: React.FormEvent<HTMLInputElement>) => {
		const {currentTarget: {files}} = e;

		setBusy(true);

		if (files && files.length > 0) {
			const uploads = generateFileUpload(files);

			do {
				const upload = uploads.next();

				if (upload.done) {
					break;
				}

				upload.value.then(() => {
					toast({
						success: t("messages.customerStatementMessages.createSuccess"),
					});
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
			} while (true);

			$customerStatementMessages.refetch();
			setBusy(false);
		}
	};

	return (
		<Stack spacing={5}>
			<Section>
				<Stack direction={["column", "row"]} spacing={5}>
					<FormLeft title={t("forms.banking.sections.customerStatementMessages.title")} helperText={t("forms.banking.sections.customerStatementMessages.detailText")} />
					<FormRight>
						<Stack spacing={5}>
							<Input type={"file"} id={"fileUpload"} onChange={onChangeFile} ref={fileUploadInput} hidden multiple={batchBankAfschriftenEnabled} />
							<Box>
								<Button colorScheme={"primary"} size={"sm"} leftIcon={<AddIcon />} isLoading={$createCSM.loading || busy}
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