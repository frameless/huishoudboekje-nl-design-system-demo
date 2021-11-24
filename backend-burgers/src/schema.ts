import {makeSchema} from "nexus";
import {join} from "path";
import types from "./types";

const schema = makeSchema({
	types,
	outputs: {
		schema: join(__dirname, ".", "generated/schema.graphql"),
		typegen: join(__dirname, ".", "generated/nexusTypes.d.ts"),
	},
	// contextType: {
	// 	module: "@packages/data-context/src/DataContext.ts",
	// 	alias: "ctx",
	// 	export: "context"
	// },
});

export default schema;