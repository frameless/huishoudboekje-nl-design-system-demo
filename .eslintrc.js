module.exports = {
	root: true,
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
	plugins: ["@typescript-eslint"],

	"rules": {
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
			"getWithoutSet": false,
			"setWithoutGet": false,
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
