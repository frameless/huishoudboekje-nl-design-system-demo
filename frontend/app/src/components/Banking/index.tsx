import React, {useRef, useState} from "react";
import {Box, Button, Divider, Heading, Input, Skeleton, Stack, Text} from "@chakra-ui/core";
import {useTranslation} from "react-i18next";
import {CreateCustomerStatementMessage} from "../../services/graphql/mutations";
import {useMutation} from "@apollo/client";
import {FormLeft, FormRight, Label} from "../Forms/FormLeftRight";
import {useIsMobile} from "react-grapple";
import FileUploadItem from "../FileUploadItem";

const Banking = () => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	const csms = [];
	const fileUploadInput = useRef<HTMLInputElement>(null);

	const [uploadedFile, setUploadedFile] = useState<any>();
	const [createCSM, {loading: createCsmLoading}] = useMutation(CreateCustomerStatementMessage);

	const onChangeFile = (e: React.FormEvent<HTMLInputElement>) => {
		const {currentTarget: {validity, files}} = e;

		console.log(validity, files);
		if (files && files.length > 0) {
			setUploadedFile({file: files[0], validity});

			createCSM({
				variables: {
					file: files[0]
				}
			}).then(result => {
				console.log(result);
			}).catch(err => {
				console.log(err);
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
									<FileUploadItem file={uploadedFile.file} validity={uploadedFile.validity} />
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
						<Text>List of CSMs</Text>
					</FormRight>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Banking;