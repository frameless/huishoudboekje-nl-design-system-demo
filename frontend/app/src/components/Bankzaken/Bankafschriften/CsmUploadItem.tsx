import {CheckIcon, WarningIcon} from "@chakra-ui/icons";
import {HStack, Spinner, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {IoMdHourglass} from "react-icons/io";
import {UploadState} from "../../../models/models";
import {truncateText} from "../../../utils/things";
import { useTranslation } from "react-i18next";

const CsmUploadItem = ({upload}) => {
	const {t} = useTranslation();

	function getErrorMessage(error : string) : string{
		if(error.includes("code 413") || error.includes("exceeds the maximum configured message size") || error.includes("provided file is to big")){
			return t("errors.upload.toLarge")
		}else if(error.includes("The provided file is not an xml file")){
			return t("errors.upload.wrongFormat")
		}else if(error.includes("File already exists")){
			return t("errors.upload.alreadyExists")
		}else if(error.includes("The provided CAMT version is not supported")){
			return t("errors.upload.notCamt")
		}
		return error
	}


	return (
		<HStack justify={"space-between"} align={"center"} spacing={2}>
			<Stack>
				<Text>{truncateText(upload.file.name, 60)}</Text>
				{upload.error?.message && (
					<Text color={"red.500"}>{getErrorMessage(upload.error.message)}</Text>
				)}
			</Stack>
			{upload.state === UploadState.DONE && !upload.error && (
				<CheckIcon data-test="uploadItem.check" color={"green.500"} />
			)}
			{upload.state === UploadState.DONE && upload.error && (
				<WarningIcon data-test="bankstatement.warningIcon" color={"red.500"} />
			)}
			{upload.state === UploadState.QUEUED && (
				<IoMdHourglass />
			)}
			{upload.state === UploadState.LOADING && (
				<Spinner size={"sm"} />
			)}
		</HStack>
	);
};

export default CsmUploadItem;
