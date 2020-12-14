const fs = require("fs");
const path = require("path");

const LANG_DIR = "/../lang";
const requiredTranslationFiles = ["nl.translation.json"];

describe("Testing language files for missing translations", () => {

	it("All required language files are there", () => {

		expect(files).toEqual(expect.arrayContaining(requiredTranslationFiles));
	});

	const files = fs.readdirSync(__dirname + LANG_DIR);
	files.forEach(file => {
		it(`(${file}) contains no missing translations.`, () => {
			const fileName = path.join(__dirname, LANG_DIR, file);
			const fileContent = require(fileName);
			const json = JSON.stringify(fileContent);
			expect(json).not.toContain("__MISSING-TRANSLATION__");
		});
	});

});