const fs = require("fs");
const path = require("path");
const readline = require("readline");

const LANG_DIR = "/../lang";
const requiredTranslationFiles = ["nl.translation.json"];

const getFileLines = async (file) => {
	const fileName = path.join(__dirname, LANG_DIR, file);
	const lines = [];

	const fileStream = fs.createReadStream(fileName);
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	for await (const line of rl){
		lines.push(line);
	}

	return lines;
};

const loadFiles = async () => {
	const files = fs.readdirSync(__dirname + LANG_DIR).map(async file => {
		const lines = await getFileLines(file);
		return {
			fileName: file,
			lines,
		};
	});

	return Promise.all(files);
};

let files = [];

beforeAll(async () => {
	files = await loadFiles();
	return Promise.resolve(files);
});

describe("Testing language files for missing translations", () => {

	it("All required language files are there", () => {
		const allFoundFiles = files.map(f => f.fileName);
		expect(allFoundFiles).toEqual(expect.arrayContaining(requiredTranslationFiles));
	});

	it("Tests all files files for missing translations", () => {
		files.forEach(file => {
			file.lines.forEach((line, i) => {
				expect(line).not.toContain("__MISSING-TRANSLATION__");
			});
		});
	});

});