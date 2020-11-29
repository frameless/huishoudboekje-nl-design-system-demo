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
	components:{
		Heading: {
			sizes: {
				lg: {
					fontSize: "1.5rem"
				}
			}
		}
	},
	fontSizes: {
		lg: "1.5rem"
	},
	tenantName,
});

export default theme;