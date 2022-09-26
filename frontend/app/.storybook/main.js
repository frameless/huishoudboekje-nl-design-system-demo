const path = require("path");

module.exports = {
	framework: "@storybook/react",
	addons: [
		"storybook-dark-mode",
		"@storybook/addon-links",
		"@storybook/addon-docs",
		"@storybook/addon-essentials",
		"@storybook/preset-create-react-app",
		"@chakra-ui/storybook-addon",
		"storybook-react-i18next",
	],
	stories: ["../src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
	staticDirs: ["../public"],
	webpackFinal: async config => {
		// the emotion aliases ensure that only one context is loaded, without it the `useTheme` hook breaks in storybook
		config.resolve.alias = {
			...(config.resolve.alias ?? {}),
			"@emotion/react": path.resolve("./node_modules/@emotion/react"),
			"@emotion/styled": path.resolve("./node_modules/@emotion/styled"),
			"@emotion/core": path.resolve("./node_modules/@emotion/react"),
			"emotion-theming": path.resolve("./node_modules/@emotion/react"),
		};
		return config;
	},
	core: {
		builder: "webpack5",
	},
};
