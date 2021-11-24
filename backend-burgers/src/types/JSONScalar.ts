import {GraphQLScalarType} from "graphql";

const JSONScalar = new GraphQLScalarType({
	name: "JSON",
	serialize: (data: any) => data,
	parseValue: (data: any) => data,
});

export default JSONScalar;