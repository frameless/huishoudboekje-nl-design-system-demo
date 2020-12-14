module.exports = {
	contextSeparator: "_",
	createOldCatalogs: false,
	defaultNamespace: "translation",
	defaultValue: "__MISSING-TRANSLATION__",
	indentation: 4,
	keepRemoved: false,
	keySeparator: ".",
	lexers: {
		mjs: ["JavascriptLexer"],
		js: ["JavascriptLexer"], // if you're writing jsx inside .js files, change this to JsxLexer
		ts: ["JavascriptLexer"],
		jsx: ["JsxLexer"],
		tsx: ["JsxLexer"],
		default: ["JavascriptLexer"]
	},
	lineEnding: "auto",
	locales: ["nl"],
	namespaceSeparator: ":",
	output: "src/lang/$LOCALE.$NAMESPACE.json",
	sort: false,
	skipDefaultValues: false,
	useKeysAsDefaultValue: false,
	verbose: false,
	failOnWarnings: false,
}