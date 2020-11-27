import {extendTheme} from "@chakra-ui/react";

if (!window["branding"]) {
	document.querySelector("body")!.textContent = "Error: No tenant theme installed.";
	throw new Error("Couldn't find tenant theme.");
}

const {colors, tenantName} = window["branding"];

const theme = extendTheme({
	colors: {
		...colors,
	},
	tenantName,
});

export default theme;