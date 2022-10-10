import {Box, Input, useDisclosure} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useTranslation} from "react-i18next";
import {useCreateCustomerStatementMessageMutation, useEvaluateAlarmsMutation} from "../../../generated/graphql";
import {FileUpload} from "../../../models/models";
import {useFeatureFlag} from "../../../utils/features";
import useUploadFiles from "../../../utils/useUploadFiles";
import AddButton from "../../shared/AddButton";
import CsmUploadModal from "./CsmUploadModal";

const CsmUpload: React.FC<{refetch: VoidFunction}> = ({refetch}) => {
	const {t} = useTranslation();
	const isSignalenEnabled = useFeatureFlag("signalen");
	const csmUploadModal = useDisclosure();
	const fileUploadInput = useRef<HTMLInputElement>(null);
	const [createCSM] = useCreateCustomerStatementMessageMutation({
		context: {
			method: "fileUpload",
		},
	});
	const [evaluateAlarms] = useEvaluateAlarmsMutation();
	const [files, {addFiles}] = useUploadFiles({
		doUpload: ({file}: FileUpload) => new Promise((resolve, reject) => {
			return createCSM({variables: {file}})
				.then(() => resolve(true))
				.catch(err => reject(err));
		}),
		onDone: async () => {
			if (isSignalenEnabled) {
				await evaluateAlarms();
			}
			refetch();
			// Only close the upload modal when there were no errors
			if (!files.find(f => f.error)) {
				csmUploadModal.onClose();
			}
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
			<Input type={"file"} id={"fileUpload"} onChange={onChangeFiles} ref={fileUploadInput} hidden multiple={true} />
			<AddButton onClick={() => fileUploadInput.current?.click()}>{t("global.actions.add")}</AddButton>
		</Box>
	</>);
};

export default CsmUpload;
