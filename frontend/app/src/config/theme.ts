import {extendTheme, Tooltip} from "@chakra-ui/react";
import Button from "./theme/Button";
import Section from "./theme/custom/Section";
import Heading from "./theme/Heading";
import Link from "./theme/Link";
import Table from "./theme/Table";
import Tabs from "./theme/Tabs";

Tooltip.defaultProps = {
	hasArrow: true,
	placement: "top"
}

if (!window["branding"]) {
	document.querySelector("body")!.textContent = "Error: No tenant theme installed.";
	throw new Error("Couldn't find tenant theme.");
}

const {colors, tenantName} = window["branding"];

const theme = extendTheme({
	colors,
	components: {
		Heading,
		Tabs,
		Table,
		Section,
		Link,
		Button
	},
	fontSizes: {
		lg: "1.5rem"
	},

	// Custom
	tenantName,
});

export default theme;