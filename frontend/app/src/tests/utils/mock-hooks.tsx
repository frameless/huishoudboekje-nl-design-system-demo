export const reactI18NextMock = () => ({
	// this mock makes sure any components using the translate hook can use it without a warning being shown
	useTranslation: () => {
		return {
			t: (str: String) => str,
		};
	},
});

export const reactChakraMock = () => ({	
	...jest.requireActual('@chakra-ui/react'),
	Stack: ({ children, ...rest }) => <div {...rest}>{children}</div>,
	Heading: ({ children, ...rest }) => <div {...rest}>{children}</div>,
	HStack: ({ children, ...rest }) => <div {...rest}>{children}</div>,
});

export const reactRouterDomMock = () => ({
	// this mock makes sure any components using the translate hook can use it without a warning being shown
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	useNavigate: (str: String) => {
		// Don't do anything
	},
});
