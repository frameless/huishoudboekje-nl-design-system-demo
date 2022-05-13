import {DeepMockProxy, mockDeep, mockReset} from "jest-mock-extended";
import {Unleash} from "unleash-client";
import unleash from "../src/unleash";

jest.mock("../src/unleash", () => ({
	__esModule: true,
	default: mockDeep<Unleash>(),
}));

beforeEach(() => {
	mockReset(unleashMock);
});

export const unleashMock = unleash as unknown as DeepMockProxy<Unleash>;
