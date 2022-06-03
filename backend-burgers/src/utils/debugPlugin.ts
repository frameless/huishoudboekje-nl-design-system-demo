const debugPlugin = () => ({
	requestDidStart: async (requestContext) => ({
		executionDidStart: async (args) => {
			if (args.source.includes("IntrospectionQuery")) {
				return;
			}

			console.log("[DEBUG]", "Running document:");
			console.log(args.source);
		},
	}),
});

export default debugPlugin;