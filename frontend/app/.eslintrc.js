module.exports = {
	env: {
		"shared-node-browser": true,
		node: true,
		browser: true,
		jest: true,
	},

	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
	],
	parser: "@typescript-eslint/parser",
	plugins: [
		"@typescript-eslint",
		"react", "react-hooks",
	],

	ignorePatterns: [
		"node_modules",
		"build",
		"src/generated/**",
		"*.test.tsx",
		"*.test.ts",
		"*.js",
	],

	rules: {
		"for-direction": "warn",
		"getter-return": "warn",
		"no-await-in-loop": "warn",

		"no-extra-parens": "off",
		"@typescript-eslint/no-extra-parens": ["warn", "all", {
			ignoreJSX: "all",
		}],

		"no-prototype-builtins": "warn",
		"no-template-curly-in-string": "warn",

		"array-callback-return": "warn",
		"block-scoped-var": "warn",
		"class-methods-use-this": "warn",
		"consistent-return": "warn",
		"curly": ["warn", "all"],
		"default-case": "warn",
		"dot-location": ["warn", "property"],
		"dot-notation": ["warn", {
			allowKeywords: true,
		}],

		// Since we use Typescript, we don't need to check for JSDoc comments
		"valid-jsdoc": "off",

		// We allow the existence of only a getter and not a setter, and vice versa
		"accessor-pairs": ["off", {
			getWithoutSet: false,
			setWithoutGet: false,
		}],

		// Default rules
		"@typescript-eslint/ban-ts-comment": ["off"],
		"@typescript-eslint/no-non-null-assertion": ["off"],
		"@typescript-eslint/no-use-before-define": ["off"],
		"import/no-anonymous-default-export": ["off"],
		"react/prop-types": ["off"],
		"react/jsx-no-useless-fragment": ["error", {allowExpressions: true}],
		"react/jsx-curly-brace-presence": ["warn", {props: "always", children: "never"}],
		// "react/jsx-max-props-per-line": ["warn", {"maximum": 1, "when": "multiline"}],
		// "react/jsx-first-prop-new-line": ["warn", "multiline-multiprop"],
		// "react/jsx-closing-bracket-location": ["warn", "line-aligned"],
		"no-var": ["error"],
		"react/forbid-elements": [
			"error",
			{
				"forbid": [
					{
						element: "div",
						message: "use <Box> or <Stack> from ChakraUI instead",
					},
					{
						element: "input",
						message: "use <Input> from ChakraUI instead",
					},
					{
						element: "button",
						message: "use <Button> from ChakraUI instead",
					},
				],
			},
		],
		"indent": [
			"warn",
			"tab",
			{
				SwitchCase: 2,
			},
		],
		"brace-style": ["warn", "stroustrup"],
		"linebreak-style": ["warn", "unix"],
		"quotes": ["warn", "double"],
		"no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
		"no-trailing-spaces": ["warn"],
		"no-empty": ["warn"],
		"no-console": [
			"warn",
			{
				allow: [
					"error",
					"info",
					"warn",
				],
			},
		],
		"react/self-closing-comp": [
			"warn",
			{
				component: true,
				html: false,
			},
		],
		"react/no-multi-comp": [
			"warn",
			{
				ignoreStateless: true,
			},
		],
		"react/function-component-definition": [
			"warn",
			{
				namedComponents: "arrow-function",
				unnamedComponents: "arrow-function",
			},
		],
		"react/no-unknown-property": ["warn"],
		"no-constant-condition": ["warn", {checkLoops: false}],
		"no-redeclare": ["off"],
		"@typescript-eslint/no-redeclare": ["off"],
		"react/no-children-prop": ["warn", {allowFunctions: true}],
		"react/no-unstable-nested-components": ["warn", {
			allowAsProps: true,
		}],
		// Other ideas for rules to add:
		// "complexity": ["warn", {
		// 	max: 20,
		// }],
		// "react/jsx-max-props-per-line": [
		// 	"warn",
		// 	{
		// 		"maximum": 1,
		// 		"when": "always",
		// 	},
		// ],
		// "max-len": ["warn", {
		// 	"code": 120,
		// 	// "ignoreComments": true,
		// 	// "ignoreUrls": true,
		// 	// "ignoreStrings": true,
		// 	// "ignoreTemplateLiterals": true,
		// 	// "ignoreRegExpLiterals": true,
		// }],
	},
};
