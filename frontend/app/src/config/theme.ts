import { theme as chakraTheme } from "@chakra-ui/core";

if (!window["branding"]) {
	document.querySelector("body")!.textContent = "Error: No tenant theme installed.";
	throw new Error("Couldn't find tenant theme.");
}

const {colors, tenantName} = window["branding"];

const theme = {
	...chakraTheme,
	colors: {
		...chakraTheme.colors,
		...colors,
	},
	tenantName,
};

export default theme;