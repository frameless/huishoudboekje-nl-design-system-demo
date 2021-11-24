import {GraphQLScalarType} from "graphql";

const BedragScalar = new GraphQLScalarType({
	name: "Bedrag",
	serialize: (bedrag: number): number => bedrag / 100, // int to float
	parseValue: (bedrag: number): number => bedrag * 100, // float to int
});

export default BedragScalar;