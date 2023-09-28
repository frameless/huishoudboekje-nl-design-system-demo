import { Box, Stack } from "@chakra-ui/react";

export const reactI18NextMock = () => ({
	// this mock makes sure any components using the translate hook can use it without a warning being shown
	useTranslation: () => {
		return {
			t: (str: String) => str,
		};
	},
});

export const reactChakraMock = () => ({
	...jest.requireActual("@chakra-ui/react"),
	Stack: ({ children, ...rest }) => <Stack {...rest}>{children}</Stack>,
	Heading: ({ children, ...rest }) => <Box {...rest}>{children}</Box>,
	HStack: ({ children, ...rest }) => <Stack {...rest}>{children}</Stack>,
});

export const reactRouterDomMock = () => ({
	// this mock makes sure any components using the translate hook can use it without a warning being shown
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	useNavigate: (str: String) => {
		// Don't do anything
	},
});
