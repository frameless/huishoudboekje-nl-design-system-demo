// Reference: https://github.com/chakra-ui/chakra-ui/blob/develop/packages/theme/src/components/tabs.ts

const variantSolid = (props: Record<string, any>) => {
	const {theme} = props
	return ({
		tab: {
			...theme.components.Button.baseStyle,
			...theme.components.Button.variants.ghost(props),
			borderRadius: "md",
			_selected: theme.components.Button.variants.solid(props),
		},
	});
};

const baseStyle = {
	tabpanel: {
		px: 0,
		outline: "none",
	}
}

const variants = {
	solid: variantSolid,
}

export default {
	variants,
	baseStyle,
}