import React from "react";
import {Box, Icon, Stack, StackProps} from "@chakra-ui/core";
import prettyBytes from "pretty-bytes";

const FileUploadItem: React.FC<StackProps & { file: File, validity: ValidityState }> = ({file, validity, ...props}) => {
	return (
		<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} {...props}>
			<Box flex={1}>{file.name}</Box>
			<Box>({prettyBytes(file.size)})</Box>
			<Box>
				<Icon name={validity.valid ? "check" : "warning"} color={validity.valid ? "green.500" : "yellow.500"} />
			</Box>
		</Stack>
	);
};

export default FileUploadItem;