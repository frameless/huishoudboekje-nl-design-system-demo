export const reactI18NextMock = () => ({
	// this mock makes sure any components using the translate hook can use it without a warning being shown
	useTranslation: () => {
		return {
			t: (str) => str,
		};
	},
});

export const reactRouterDomMock = () => ({
	// this mock makes sure any components using the translate hook can use it without a warning being shown
	useNavigate: (str) => {
		// Don't do anything
	},
});

