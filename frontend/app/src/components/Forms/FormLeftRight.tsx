import React from "react";
import {BoxProps, Stack} from "@chakra-ui/core";

export const FormLeft: React.FC<BoxProps> = (props) => (
	<Stack flex={1} spacing={1} {...props} />
);

export const FormRight: React.FC<BoxProps> = (props) => (
	<Stack flex={2} spacing={4} {...props} />
);