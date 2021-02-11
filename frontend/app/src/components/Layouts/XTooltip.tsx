import { Tooltip } from "@chakra-ui/react";
import React from "react";

const XTooltip = (props) => {
	return (
		<Tooltip placement={"top"} hasArrow {...props} />
	);
};

export default XTooltip;