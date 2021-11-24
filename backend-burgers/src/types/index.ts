import {objectType} from "nexus";
import * as models from "../models";
import burger from "../queries/burger";
import BedragScalar from "./Bedrag";
import DayOfWeek from "./DayOfWeek";
import JSONScalar from "./JSONScalar";

const Query = objectType({
	name: "Query",
	description: "GraphQL Query",
	definition: t => {
		burger(t);
	},
});

const types = {
	DayOfWeek,
	BedragScalar,
	JSONScalar,
	Query,
	...models,
};

export default types;