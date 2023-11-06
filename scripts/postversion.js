console.log("Running postversion script...");

const updateVersions = () => {
	console.log("Updating versions package.json of subpackages...");

	const {exec} = require("child_process");
	const {version} = require("../package.json");
	const {resolve} = require("path");

	const npmPackages = [
		resolve(__dirname, "..", "frontend", "app"),
	];

	npmPackages.forEach(directory => {
		exec(`cd ${directory} && npm version ${version}`);
	});
};

updateVersions();

console.log("Done!");