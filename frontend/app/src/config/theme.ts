import {extendTheme, Tooltip} from "@chakra-ui/react";
import {Regex} from "../utils/things";
import zod from "../utils/zod";
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

// @ts-ignore (window.branding should be set in index.html)
const branding = window.branding;

if (!branding) {
	const errorMessage = "Error: No tenant theme installed. Please install a theme in public/theme.";
	document.body.textContent = errorMessage;
	throw new Error(errorMessage);
}

const validateBranding = (branding) => {
	const colorObject = zod.object({
		50: zod.string().regex(Regex.HexColor, "This is not a valid hex color."),
		100: zod.string().regex(Regex.HexColor, "This is not a valid hex color."),
		200: zod.string().regex(Regex.HexColor, "This is not a valid hex color."),
		300: zod.string().regex(Regex.HexColor, "This is not a valid hex color."),
		400: zod.string().regex(Regex.HexColor, "This is not a valid hex color."),
		500: zod.string().regex(Regex.HexColor, "This is not a valid hex color."),
		600: zod.string().regex(Regex.HexColor, "This is not a valid hex color."),
		700: zod.string().regex(Regex.HexColor, "This is not a valid hex color."),
		800: zod.string().regex(Regex.HexColor, "This is not a valid hex color."),
		900: zod.string().regex(Regex.HexColor, "This is not a valid hex color."),
	});

	const brandingValidator = zod.object({
		tenantName: zod.string(),
		colors: zod.object({
			primary: colorObject,
			secondary: colorObject,
		}),
	});

	try {
		return brandingValidator.parse(branding);
	}
	catch (err) {
		document.body.innerHTML = "";
		document.body.style.fontFamily = "sans-serif";

		const errorTextElement = document.createElement("p");
		errorTextElement.textContent = "Error: Invalid theme installed.";
		errorTextElement.style.color = "red";
		errorTextElement.style.fontWeight = "bold";
		document.body.append(errorTextElement);

		const jsonElement = document.createElement("pre");
		jsonElement.innerHTML = JSON.stringify(err.issues, null, 2);
		document.body.append(jsonElement);

		throw new Error("Invalid theme installed.");
	}
};

const {colors, tenantName} = validateBranding(branding);

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
