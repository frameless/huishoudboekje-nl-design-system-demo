const pkg = require("./package.json");
const {resolve, relative} = require("path");
const {writeFileSync, existsSync, mkdirSync} = require("fs");
const {gitDescribeSync} = require("git-describe");
const {hash} = gitDescribeSync();

const {version} = pkg;
const rawVersion = `${version} ${hash ? `(${hash})` : ""}`;

if (!existsSync(resolve(__dirname, "src"))) {
	mkdirSync(resolve(__dirname, "src"))
}
const file = resolve(__dirname, "src", "version.ts");
const data = `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECK IN!
/* eslint-disable */
const VERSION = "${rawVersion}";
export default VERSION;
/* eslint-enable */`;
writeFileSync(file, data, {encoding: "utf-8"});

console.log(`Version info ${rawVersion} saved in ${relative(resolve(__dirname, ".."), file)}`);