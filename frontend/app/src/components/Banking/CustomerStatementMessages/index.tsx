import {AddIcon} from "@chakra-ui/icons";
import {Box, Button, Divider, Input, Stack, useToast} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {CustomerStatementMessage, useCreateCustomerStatementMessageMutation, useGetAllCsmsQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";
import CsmListView from "./CsmListView";

const CustomerStatementMessages = () => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	const toast = useToast();
	const fileUploadInput = useRef<HTMLInputElement>(null);

	const $customerStatementMessages = useGetAllCsmsQuery({
		fetchPolicy: "no-cache"
	});
	const [createCSM, $createCSM] = useCreateCustomerStatementMessageMutation({
		context: {
			method: "fileUpload"
		}
	});

	const onChangeFile = (e: React.FormEvent<HTMLInputElement>) => {
		const {currentTarget: {files}} = e;

		if (files && files.length > 0) {
			createCSM({
				variables: {
					file: files[0]
				}
			}).then(() => {
				toast({
					status: "success",
					title: t("messages.customerStatementMessages.createSuccess"),
					position: "top",
				});
				$customerStatementMessages.refetch();
			}).catch(err => {
				console.error(err);
				toast({
					position: "top",
					status: "error",
					variant: "solid",
					title: t("messages.genericError.title"),
					description: t("messages.customerStatementMessages.incorrectFileError"),
				});
			})

		}
	};

	return (
		<Stack spacing={5}>
			<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
				<Stack direction={isMobile ? "column" : "row"} spacing={5}>
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

						<Queryable query={$customerStatementMessages}>{(data: { customerStatementMessages: CustomerStatementMessage[] }) => {
							/* Sort CSMs so that the newest appears first */
							const csms = [...data.customerStatementMessages].sort((a, b) => a.uploadDate <= b.uploadDate ? 1 : -1);
							return (<CsmListView csms={csms} refresh={$customerStatementMessages.refetch} />);
						}}
						</Queryable>
					</FormRight>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default CustomerStatementMessages;