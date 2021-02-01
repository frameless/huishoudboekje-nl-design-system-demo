import {Stack, useStyleConfig} from "@chakra-ui/react";
import React from "react";

const Section = (props) => {
	const styles = useStyleConfig("Section");
	return (
		<Stack sx={styles} {...props} />
	);
};

export default Section;