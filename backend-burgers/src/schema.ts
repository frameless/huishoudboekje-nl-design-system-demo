import {makeSchema} from "@nexus/schema";
import {join} from "path";
import types from "./types";

const schema = makeSchema({
	types,
	outputs: {
		schema: join(__dirname, ".", "schema.graphql"),
	},
	typegenAutoConfig: {
		sources: [
			{
				source: join(__dirname, ".", "types", "context.ts"),
				alias: "Context",
			},
		],
		contextType: "Context.Context",
	},
});

export default schema;