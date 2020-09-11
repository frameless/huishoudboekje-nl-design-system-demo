import { theme as chakraTheme } from "@chakra-ui/core";

if (!window["branding"]) {
	document.querySelector("body")!.textContent = "Error: No tenant theme installed."
	throw new Error("Couldn't find tenant theme.");
}

const colors = window["branding"].colors;

const theme = {
	...chakraTheme,
	colors: {
		...chakraTheme.colors,
		...colors,
	},
};

export default theme;