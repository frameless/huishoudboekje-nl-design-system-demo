import {extendTheme, Tooltip} from "@chakra-ui/react";
import Button from "./theme/Button";
import FormLabel from "./theme/FormLabel";
import Heading from "./theme/Heading";
import Link from "./theme/Link";
import Table from "./theme/Table";
import Tabs from "./theme/Tabs";

Tooltip.defaultProps = {
	hasArrow: true,
	placement: "top",
};

// @ts-ignore
const branding = window.branding ?? {};

if (!branding) {
	document.querySelector("body")!.textContent = "Error: No tenant theme installed.";
	throw new Error("Couldn't find tenant theme.");
}

const {colors, tenantName} = branding;

const theme = extendTheme({
	colors,
	components: {
		Heading,
		Tabs,
		Table,
		Link,
		Button,
		FormLabel,
	},
	fontSizes: {
		lg: "1.5rem",
	},

	// Custom
	tenantName,
});

export default theme;
