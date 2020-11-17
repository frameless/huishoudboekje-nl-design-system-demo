import React, {useRef, useState} from "react";
import {Box, Button, Divider, Heading, IconButton, Input, Skeleton, Stack, Text, useToast} from "@chakra-ui/core";
import {useTranslation} from "react-i18next";
import {CreateCustomerStatementMessage} from "../../services/graphql/mutations";
import {useMutation, useQuery} from "@apollo/client";
import {FormLeft, FormRight, Label} from "../Forms/FormLeftRight";
import {useIsMobile} from "react-grapple";
import FileUploadItem from "../FileUploadItem";
import {GetAllCustomerStatementMessagesQuery} from "../../services/graphql/queries";
import Queryable from "../../utils/Queryable";
import {ICustomerStatementMessage} from "../../models";
import {dateFormat} from "../../utils/things";

type UploadedCSM = {
	file: File,
	validity: ValidityState,
	success: boolean
}

const Banking = () => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	const toast = useToast();
	const csms = [];
	const fileUploadInput = useRef<HTMLInputElement>(null);

	const [uploadedFile, setUploadedFile] = useState<UploadedCSM>();
	const $customerStatementMessages = useQuery<{ customerStatementMessages: ICustomerStatementMessage[] }>(GetAllCustomerStatementMessagesQuery);
	const [createCSM, {loading: createCsmLoading}] = useMutation(CreateCustomerStatementMessage, {
		context: {
			method: "fileUpload"
		}
	});

	const onChangeFile = (e: React.FormEvent<HTMLInputElement>) => {
		const {currentTarget: {validity, files}} = e;

		if (files && files.length > 0) {
			createCSM({
				variables: {
					file: files[0]
				}
			}).then(() => {
				setUploadedFile({file: files[0], validity, success: true});
				toast({
					status: "success",
					title: t("messages.banking.createSuccessMessage"),
					position: "top",
				});
			}).catch(err => {
				console.error(err);

				setUploadedFile({file: files[0], validity, success: false});
				toast({
					position: "top",
					status: "error",
					variant: "solid",
					title: t("messages.genericError.title"),
					description: t("messages.genericError.description"),
				});
			})

		}
	};

	return (
		<Stack spacing={5}>
			<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
				<Stack direction={"row"} spacing={5} alignItems={"center"}>
					<Heading size={"lg"}>{t("banking.banking")}</Heading>
				</Stack>
			</Stack>

			<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
				<Stack direction={isMobile ? "column" : "row"} spacing={5}>
					<FormLeft spacing={3}>
						<Stack spacing={1}>
							<Heading size={"md"}>{t("forms.banking.sections.customerStatementMessages.title")}</Heading>
							<Label>{t("forms.banking.sections.customerStatementMessages.detailText")}</Label>
						</Stack>

						<Box>
							<Divider />
						</Box>

						<Input type={"file"} id={"fileUpload"} onChange={onChangeFile} hidden={true} ref={fileUploadInput} />

						<Stack spacing={5} id={"stack"}>
							{uploadedFile && (
								<Skeleton isLoaded={!createCsmLoading}>
									<FileUploadItem file={uploadedFile.file} validity={uploadedFile.validity} success={uploadedFile.success} />
								</Skeleton>
							)}
							<Box>
								<Button variantColor={"primary"} size={"sm"} leftIcon={"add"} isLoading={createCsmLoading}
								        onClick={() => fileUploadInput.current?.click()}>{t("actions.add")}</Button>
							</Box>
						</Stack>
						<Stack spacing={5}>
							{csms.map(c => <pre>{JSON.stringify(c, null, 2)}</pre>)}
						</Stack>
					</FormLeft>
					<FormRight>

						<Queryable query={$customerStatementMessages}>{(data: { customerStatementMessages: ICustomerStatementMessage[] }) => (
							<table width={"100%"}>
								<thead>
									<tr>
										<td>{t("forms.common.fields.date")}</td>
										<td>{t("forms.banking.bankAccount")}</td>
										<td>{t("forms.banking.nTransactions")}</td>
										<td>{t("actions.actions")}</td>
									</tr>
								</thead>
								<tbody>
									{data.customerStatementMessages.map(csm => (
										<tr>
											<td>{dateFormat.format(new Date(csm.uploadDate))}</td>
											<td>{csm.accountIdentification}</td>
											<td style={{textAlign: "right", paddingRight: "10px"}}>
												<Text mr={4}>{csm.bankTransactions.length}</Text>
											</td>
											<td>
												<IconButton size={"sm"} variant={"ghost"} aria-label={t("actions.delete")} icon={"delete"} />
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
						</Queryable>

					</FormRight>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Banking;