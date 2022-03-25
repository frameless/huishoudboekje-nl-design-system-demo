import util from "util";

const debugPlugin = () => ({
	async requestDidStart() {
		return {
			async executionDidStart() {
				return {
					willResolveField({info}) {
						return (error, result) => {
							console.log(`Resolved ${info.parentType.name}.${info.fieldName} with`, result ? util.inspect(result, false, null, true) : error);
						};
					},
				};
			},
		};
	},
});

export default debugPlugin;