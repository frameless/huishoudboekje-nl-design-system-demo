import {Box, Input, useDisclosure} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useTranslation} from "react-i18next";
import {useCreateCustomerStatementMessageMutation} from "../../../generated/graphql";
import {FileUpload} from "../../../models/models";
import useUploadFiles from "../../../utils/useUploadFiles";
import AddButton from "../../shared/AddButton";
import CsmUploadModal from "./CsmUploadModal";

const CsmUpload: React.FC<{refetch: VoidFunction}> = ({refetch}) => {
	const {t} = useTranslation();
	const csmUploadModal = useDisclosure();
	const fileUploadInput = useRef<HTMLInputElement>(null);
	const [createCSM] = useCreateCustomerStatementMessageMutation({
		context: {
			method: "fileUpload",
		},
	});
	const [files, {addFiles}] = useUploadFiles({
		doUpload: ({file}: FileUpload) => new Promise(resolve => {
			return createCSM({
				variables: {file},
			}).then(() => resolve(true));
		}),
		onDone: () => refetch(),
	});

	const onChangeFiles = async (e: React.FormEvent<HTMLInputElement>) => {
		const files = e.currentTarget.files;

		if (files && files.length > 0) {
			csmUploadModal.onOpen();
			addFiles(files);
		}
	};

	return (<>
		{files.length > 0 && (
			<CsmUploadModal uploads={files} />
		)}

		<Box>
			<Input type={"file"} id={"fileUpload"} onChange={onChangeFiles} ref={fileUploadInput} hidden multiple={true} />
			<AddButton onClick={() => fileUploadInput.current?.click()}>{t("global.actions.add")}</AddButton>
		</Box>
	</>);
};

export default CsmUpload;