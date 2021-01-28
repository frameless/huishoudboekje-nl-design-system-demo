// Reference: https://github.com/chakra-ui/chakra-ui/blob/develop/packages/theme/src/components/table.ts

const noPaddingOnFirstTableCell = {
	"&:first-of-type": {
		pl: 0
	}
};

const baseStyle = {
	thead: {
		th: {
			...noPaddingOnFirstTableCell
		},
	},
	tbody: {
		td: {
			...noPaddingOnFirstTableCell
		},
	},
}

export default {
	baseStyle,
}