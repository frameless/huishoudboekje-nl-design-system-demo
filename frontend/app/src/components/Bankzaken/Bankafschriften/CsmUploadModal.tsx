import {AddIcon, CheckIcon, WarningIcon} from "@chakra-ui/icons";
import {Box, Button, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Stack, Text} from "@chakra-ui/react";
import React, {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {IoMdHourglass} from "react-icons/io";
import {GetCsmsDocument, useCreateCustomerStatementMessageMutation} from "../../../generated/graphql";
import {truncateText} from "../../../utils/things";

enum UploadState {
	QUEUED,
	LOADING,
	DONE
}

type FileUpload = {
	file: File,
	state: UploadState,
	error?: Error,
}

type CsmUploadModalProps = {
	onClose: VoidFunction,
}

const CsmUploadModal: React.FC<CsmUploadModalProps> = ({onClose}) => {
	const {t} = useTranslation();
	const fileUploadInput = useRef<HTMLInputElement>(null);
	const [uploads, setUploads] = useState<FileUpload[]>([]);
	const [createCSM, $createCSM] = useCreateCustomerStatementMessageMutation({
		context: {
			method: "fileUpload",
		},
		refetchQueries: [
			{query: GetCsmsDocument},
		],
	});

	const onChangeFile = async (e: React.FormEvent<HTMLInputElement>) => {
		const files = e.currentTarget.files;

		if (files && files.length > 0) {
			const filesArray = Array.from(files);

			const newUploads = filesArray.map(f => ({
				file: f,
				loading: false,
				state: UploadState.QUEUED,
			}));

			setUploads(u => [...u, ...newUploads]);

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

	return (
		<Modal isOpen={true} onClose={onClose}>
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

						<Box>
							<Input type={"file"} id={"fileUpload"} onChange={onChangeFile} ref={fileUploadInput} hidden multiple={true} />
							<Button colorScheme={"primary"} size={"sm"} leftIcon={<AddIcon />} onClick={() => fileUploadInput.current?.click()}>{t("actions.selectFile")}</Button>
						</Box>
					</Stack>
				</ModalBody>
				<ModalFooter>
					<HStack>
						<Button colorScheme={"primary"} onClick={onClose} isLoading={$createCSM.loading}>{t("actions.close")}</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CsmUploadModal;