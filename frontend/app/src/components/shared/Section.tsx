import {Box, Stack, StackProps, useStyleConfig} from "@chakra-ui/react";
import React from "react";

const Section: React.FC<StackProps> = ({...props}) => {
	const styles = useStyleConfig("Section");
	return (
		<Stack as={Box} sx={styles} {...props} />
	);
};

export default Section;