// Reference: https://github.com/chakra-ui/chakra-ui/blob/develop/packages/theme/src/components/table.ts

const noPaddingOnFirstTableCell = {
	"&:first-of-type": {
		pl: 0
	}
};

const baseStyle = {
	thead: {
		th: {
			...noPaddingOnFirstTableCell,
			fontWeight: "normal",
			textTransform: "none",
			letterSpacing: 0,
			fontSize: "sm",
			color: "gray.500"
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