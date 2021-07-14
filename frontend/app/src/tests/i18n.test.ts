import {findPathsByValue} from "@koenbrouwer/find-path-by-value";
import fs from "fs";
import path from "path";
import i18nParserConfig from "../../i18next-parser.config";

const LANG_DIR = "/../lang";
const needle = i18nParserConfig.defaultValue;

const loadFiles = () => fs.readdirSync(path.join(__dirname, LANG_DIR)).map(file => {
	const content = require(path.join(__dirname, LANG_DIR, file));
	return {
		content,
		fileName: file,
		toString: () => file,
	};
});

describe("Testing language files for missing translations.", () => {

	const files = loadFiles();

	test.each(files)("Test if translation file %s contains no missing translations.", (file) => {
		const paths = findPathsByValue(file.content, needle);
		expect(paths).toHaveLength(0);
	});

});