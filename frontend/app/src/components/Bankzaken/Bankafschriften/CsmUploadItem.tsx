import {CheckIcon, WarningIcon} from "@chakra-ui/icons";
import {HStack, Spinner, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {IoMdHourglass} from "react-icons/io";
import {UploadState} from "../../../models/models";
import {truncateText} from "../../../utils/things";

const CsmUploadItem = ({upload}) => {
	return (
		<HStack justify={"space-between"} align={"center"} spacing={2}>
			<Stack>
				<Text>{truncateText(upload.file.name, 60)}</Text>
				{upload.error?.message && (
					<Text color={"red.500"}>{upload.error.message}</Text>
				)}
			</Stack>
			{upload.state === UploadState.DONE && !upload.error && (
				<CheckIcon data-test="uploadItem.check" color={"green.500"} />
			)}
			{upload.state === UploadState.DONE && upload.error && (
				<WarningIcon color={"red.500"} />
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
