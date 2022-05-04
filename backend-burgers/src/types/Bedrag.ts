import {GraphQLScalarType} from "graphql";

const BedragScalar = new GraphQLScalarType({
	name: "Bedrag",
	serialize: (bedrag: unknown): number => parseInt(String(bedrag)) / 100, // int to float
	parseValue: (bedrag: unknown): number => parseInt(String(bedrag)) * 100, // float to int
});

export default BedragScalar;