export const createMockedFetch = (fetch, data: any) => {
	const jestFn = jest.fn(() => ({
		data,
	}));

	fetch.mockReturnValue(Promise.resolve({
		json: jestFn,
	}));

	return jestFn;
};