import {objectType} from "nexus";
import Afspraak from "../models/Afspraak";
import Burger from "../models/Burger";
import burger from "../queries/burger";
import burgers from "../queries/burgers";

const Query = objectType({
	name: "Query",
	description: "GraphQL Query",
	definition: t => {
		burgers(t);
		burger(t);
	},
});

const types = {
	Query,
	Burger,
	Afspraak,
};

export default types;