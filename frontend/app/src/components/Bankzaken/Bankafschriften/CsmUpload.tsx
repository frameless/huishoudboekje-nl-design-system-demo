import {Box, Button, Input, useDisclosure} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useTranslation} from "react-i18next";
import {useUploadCustomerStatementMessageMutation} from "../../../generated/graphql";
import {FileUpload} from "../../../models/models";
import useUploadFiles from "../../../utils/useUploadFiles";
import AddButton from "../../shared/AddButton";
import CsmUploadModal from "./CsmUploadModal";

const CsmUpload: React.FC<{refetch: VoidFunction}> = ({refetch}) => {
	const {t} = useTranslation();
	const csmUploadModal = useDisclosure();
	const fileUploadInput = useRef<HTMLInputElement>(null);
	const [createCSM] = useUploadCustomerStatementMessageMutation({
		context: {
			method: "fileUpload",
		},
	});
	const [files, {addFiles}] = useUploadFiles({
		doUpload: ({file}: FileUpload) => new Promise((resolve, reject) => {
			return createCSM({variables: {
				input: {
					file
				}
			}})
				.then(() => resolve(true))
				.catch(err => reject(err));
		}),
		onDone: async () => {
			refetch();
		},
	});

	const onChangeFiles = async (e: React.FormEvent<HTMLInputElement>) => {
		const files = e.currentTarget.files;

		if (files && files.length > 0) {
			csmUploadModal.onOpen();
			addFiles(files);
		}
	};

	return (<>
		{csmUploadModal.isOpen && (
			<CsmUploadModal uploads={files} onClose={() => csmUploadModal.onClose()} />
		)}

		<Box>
			<Input type={"file"} id={"fileUpload"} onChange={onChangeFiles} ref={fileUploadInput} hidden={true} multiple={true} />
			<Button colorScheme="primary" data-test="fileUpload" onClick={() => fileUploadInput.current?.click()}>{t("global.actions.add")}</Button>
		</Box>
	</>);
};

export default CsmUpload;
