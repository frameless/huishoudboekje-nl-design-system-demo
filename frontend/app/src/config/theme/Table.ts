// Reference: https://github.com/chakra-ui/chakra-ui/blob/develop/packages/theme/src/components/table.ts

const baseStyle = {
	thead: {
		th: {
			fontWeight: "normal",
			textTransform: "none",
			letterSpacing: 0,
			fontSize: "sm",
			color: "gray.500",
			paddingLeft: 0,
		},
	},
	tbody: {
		td: {
			paddingLeft: 0,
		},
	},
};

const sizes = {
	sm: {
		th: {
			px: "4",
			py: "1",
			lineHeight: "4",
			fontSize: "sm",
		},
		td: {
			px: "4",
			py: "2",
			fontSize: "md",
			lineHeight: "4",
		},
		caption: {
			px: "4",
			py: "2",
			fontSize: "sm",
		},
	},
	md: {
		th: {
			px: "6",
			py: "3",
			lineHeight: "4",
			fontSize: "xs",
		},
		td: {
			px: "6",
			py: "4",
			lineHeight: "5",
		},
		caption: {
			px: "6",
			py: "2",
			fontSize: "sm",
		},
	},
	lg: {
		th: {
			px: "8",
			py: "4",
			lineHeight: "5",
			fontSize: "sm",
		},
		td: {
			px: "8",
			py: "5",
			lineHeight: "6",
		},
		caption: {
			px: "6",
			py: "2",
			fontSize: "md",
		},
	},
};

export default {
	baseStyle,
	sizes,
};