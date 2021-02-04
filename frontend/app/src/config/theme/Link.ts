// Reference: https://github.com/chakra-ui/chakra-ui/blob/develop/packages/theme/src/components/link.ts

const baseStyle = {
	textDecoration: "none",
};

const variants = {
	inline: {
		fontWeight: "600",
		_hover: {
			textDecoration: "underline",
		}
	}
}

export default {
	baseStyle,
	variants,
}