module.exports = {
	"extends": [
		"../../.eslintrc.js",
	],
	"plugins": [
		"react", "react-hooks",
	],
	"rules": {
		"@typescript-eslint/no-use-before-define": ["off"],
		"import/no-anonymous-default-export": ["off"],
		"react/prop-types": ["off"],
		"react/jsx-no-useless-fragment": ["error", {"allowExpressions": true}],
		"react/jsx-curly-brace-presence": ["warn", {"props": "always", "children": "never"}],
		// "react/jsx-max-props-per-line": ["warn", {"maximum": 1, "when": "multiline"}],
		// "react/jsx-first-prop-new-line": ["warn", "multiline-multiprop"],
		// "react/jsx-closing-bracket-location": ["warn", "line-aligned"],
		"no-var": ["error"],
		"react/forbid-elements": [
			"error",
			{
				"forbid": [
					{
						"element": "div",
						"message": "use <Box> or <Stack> from ChakraUI instead",
					},
					{
						"element": "input",
						"message": "use <Input> from ChakraUI instead",
					},
					{
						"element": "button",
						"message": "use <Button> from ChakraUI instead",
					},
				],
			},
		],
		"indent": [
			"warn",
			"tab",
			{
				"SwitchCase": 2,
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
				"allow": [
					"error",
					"info",
				],
			},
		],
		"react/self-closing-comp": [
			"warn",
			{
				"component": true,
				"html": false,
			},
		],
		"react/no-multi-comp": [
			"warn",
			{
				"ignoreStateless": true,
			},
		],
		"react/function-component-definition": [
			"warn",
			{
				"namedComponents": "arrow-function",
				"unnamedComponents": "arrow-function",
			},
		],
		"react/no-unknown-property": ["warn"],
		"no-constant-condition": ["warn", {"checkLoops": false}],
		"no-redeclare": ["off"],
		"@typescript-eslint/no-redeclare": ["off"],
		"react/no-children-prop": ["warn", {"allowFunctions": true}],
	},
	"ignorePatterns": [
		"node_modules",
		"build",
		"src/generated/**",
	],
};
