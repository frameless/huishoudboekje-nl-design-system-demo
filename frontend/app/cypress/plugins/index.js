/// <reference types="cypress" />
const fs = require("fs");
const path = require("path");

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
	on("task", {
		getSchema() {
			return fs.readFileSync(
				path.resolve(__dirname, "../../../../frontend/app/schema.graphql"),
				"utf8"
			);
		}
	});
};