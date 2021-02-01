import {extendTheme} from "@chakra-ui/react";
import Heading from "./theme/Heading";
import Tabs from "./theme/Tabs";

if (!window["branding"]) {
	document.querySelector("body")!.textContent = "Error: No tenant theme installed.";
	throw new Error("Couldn't find tenant theme.");
}

const {colors, tenantName} = window["branding"];

const theme = extendTheme({
	colors,
	components: {
		Heading,
		Tabs
	},
	fontSizes: {
		lg: "1.5rem"
	},

	// Custom
	tenantName,
});

export default theme;