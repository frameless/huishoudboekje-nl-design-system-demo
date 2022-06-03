import {makeSchema} from "nexus";
import path, {join} from "path";
import types from "./types";
import {isDev} from "./utils/things";

const schema = makeSchema({
	types,
	shouldGenerateArtifacts: isDev,
	outputs: {
		schema: join(__dirname, "..", "generated/schema.graphql"),
		typegen: join(__dirname, "..", "generated/nexusTypes.d.ts"),
	},
	contextType: {
		module: path.join(__dirname, "context.ts"),
		export: "Context",
	},
});

export default schema;