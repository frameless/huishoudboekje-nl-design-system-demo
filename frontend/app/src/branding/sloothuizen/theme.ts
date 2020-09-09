import {theme as chakraTheme} from "@chakra-ui/core";

const customColors = {
	primary: {
		50: '#e7e4ff',
		100: '#b7b3ff',
		200: '#8980ff',
		300: '#594dff',
		400: '#2c1bfe',
		500: '#1401e5',
		600: '#0d00b3',
		700: '#070081',
		800: '#030050',
		900: '#010020',
	},
	secondary: {
		50: '#ffe2e4',
		100: '#ffb2b4',
		200: '#ff8084',
		300: '#fe4e53',
		400: '#fe2023',
		500: '#e50a0a',
		600: '#b20307',
		700: '#800004',
		800: '#4e0000',
		900: '#1f0000',
	}
};

const theme = {
	...chakraTheme,
	colors: {
		...chakraTheme.colors,
		...customColors,
		red: customColors.primary,
		blue: customColors.secondary
	}
}

export default theme;