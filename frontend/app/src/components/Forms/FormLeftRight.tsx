import React from "react";
import {BoxProps, Stack} from "@chakra-ui/core";

const FormLeft: React.FC<BoxProps> = ({children, ...props}) => (
	<Stack flex={1} spacing={1} {...props} mb={5}>{children}</Stack>
);

const FormRight: React.FC<BoxProps> = ({children, ...props}) => (
	<Stack flex={2} spacing={4} {...props}>{children}</Stack>
)

export {FormLeft, FormRight};