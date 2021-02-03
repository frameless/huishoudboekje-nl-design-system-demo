// Reference: https://github.com/chakra-ui/chakra-ui/blob/develop/packages/theme/src/components/link.ts

const baseStyle = {
	textDecoration: "none",
};

const variants = {
	inline: {
		textDecoration: "underline",
		color: "inherit",
		_hover: {
			color: "primary.700",
		}
	}
}

export default {
	baseStyle,
	variants,
}