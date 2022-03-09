import {CheckIcon, WarningIcon} from "@chakra-ui/icons";
import {Box, Button, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Stack, Text, useDisclosure} from "@chakra-ui/react";
import React, {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {IoMdHourglass} from "react-icons/io";
import {GetCsmsDocument, useCreateCustomerStatementMessageMutation} from "../../../generated/graphql";
import {FileUpload, UploadState} from "../../../models/models";
import {truncateText} from "../../../utils/things";
import AddButton from "../../shared/AddButton";

const CsmUpload = () => {
	const {t} = useTranslation();
	const modal = useDisclosure();
	const fileUploadInput = useRef<HTMLInputElement>(null);
	const [uploads, setUploads] = useState<FileUpload[]>([]);
	const [createCSM, $createCSM] = useCreateCustomerStatementMessageMutation({
		context: {
			method: "fileUpload",
		},
		refetchQueries: [
			{query: GetCsmsDocument},
			// We would actually like to refetch GetTransactiesDocument, but at this moment we can't because we don't have access to pagination settings that are set only when the page itself is built.
			// An idea could be to store the pagination settings in the store, so that they can be accessed from there, and put in place here. (24-02-2022)
			// {query: GetTransactiesDocument, variables: { *** }}
		],
	});

	const onChangeFile = async (e: React.FormEvent<HTMLInputElement>) => {
		modal.onOpen();
		const files = e.currentTarget.files;

		if (files && files.length > 0) {
			const filesArray = Array.from(files);

			const newUploads = filesArray.map(f => ({
				file: f,
				loading: false,
				state: UploadState.QUEUED,
			}));

			setUploads(newUploads);

			for (const nu of newUploads) {
				setUploads(prevUploads => ([
					...prevUploads.map(pu => {
						if (pu.file.name === nu.file.name) {
							pu.state = UploadState.LOADING;
						}
						return pu;
					}),
				]));

				await new Promise((resolve, reject) => {
					createCSM({
						variables: {file: nu.file},
					}).then(result => {
						// Wait for the backend to finish
						setUploads(prevUploads => ([
							...prevUploads.map(pu => {
								if (pu.file.name === nu.file.name) {
									pu.state = UploadState.DONE;
								}
								return pu;
							}),
						]));
						resolve(result);
					}).catch(err => {
						setUploads(prevUploads => ([
							...prevUploads.map(pu => {
								if (pu.file.name === nu.file.name) {
									pu.state = UploadState.DONE;
									pu.error = err;
								}
								return pu;
							}),
						]));
						resolve(err);
					});
				});
			}
		}
	};

	return (<>
		<Modal isOpen={modal.isOpen} onClose={modal.onClose}>
			<ModalOverlay />
			<ModalContent minWidth={["90%", null, "800px"]}>
				<ModalHeader>{t("uploadCsmModal.title")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing={5}>
						{uploads.map((u, i) => (
							<HStack key={i} justify={"space-between"} align={"center"} spacing={2}>
								<Stack>
									<Text>{truncateText(u.file.name, 60)}</Text>
									{u.error?.message && (
										<Text color={"red.500"}>{truncateText(u.error.message, 60)}</Text>
									)}
								</Stack>
								{u.state === UploadState.DONE && !u.error && (
									<CheckIcon color={"green.500"} />
								)}
								{u.state === UploadState.DONE && u.error && (
									<WarningIcon color={"red.500"} />
								)}
								{u.state === UploadState.QUEUED && (
									<IoMdHourglass />
								)}
								{u.state === UploadState.LOADING && (
									<Spinner size={"sm"} />
								)}
							</HStack>
						))}
					</Stack>
				</ModalBody>
				<ModalFooter>
					<HStack>
						<Button colorScheme={"primary"} onClick={() => modal.onClose()} isLoading={$createCSM.loading}>{t("global.actions.close")}</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>

		<Box>
			<Input type={"file"} id={"fileUpload"} onChange={onChangeFile} ref={fileUploadInput} hidden multiple={true} />
			<AddButton onClick={() => fileUploadInput.current?.click()}>{t("global.actions.add")}</AddButton>
		</Box>
	</>);
};

export default CsmUpload;