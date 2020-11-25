/// <reference types="cypress" />
import fs from "fs";
import path from "path";

export default (on, config) => {
	on("task", {
		getSchema: (): string => {
			return fs.readFileSync(
				path.resolve(__dirname, "../../../../frontend/app/schema.graphql"),
				"utf8"
			);
		}
	});
}