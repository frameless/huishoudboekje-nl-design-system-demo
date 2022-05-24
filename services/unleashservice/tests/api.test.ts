import supertest from "supertest";
import {FeatureInterface} from "unleash-client/lib/feature";
import {unleashMock} from "../.jest/mockUnleashClient";
import app from "../src/app";

const api = supertest(app());

const featureFlags: FeatureInterface[] = [
	{name: "feature1", description: "Some description1", enabled: true, stale: false, impressionData: false, strategies: [], variants: []},
	{name: "feature2", description: "Some description2", enabled: false, stale: false, impressionData: false, strategies: [], variants: []},
	{name: "feature3", description: "Some description3", enabled: true, stale: false, impressionData: false, strategies: [], variants: []},
];

const mockFeatures = (featureFlags: FeatureInterface[] = []) => {
	unleashMock.getFeatureToggleDefinitions.mockReturnValue(featureFlags);
	unleashMock.isEnabled.mockImplementation((name) => {
		const featureFlag = featureFlags.find(f => f.name === name);
		return !!featureFlag?.enabled;
	});
};

describe("Unleash", () => {

	it("should return the entire list of features", async () => {
		mockFeatures(featureFlags);

		const result = await api.get("/api/unleash");
		expect(result.status).toBe(200);
		expect(unleashMock.getFeatureToggleDefinitions).toHaveBeenCalledTimes(1);
		expect(result.body).toMatchSnapshot();
		expect(result.body.features.length).toStrictEqual(featureFlags.length);
	});

	describe("Given the feature flags exist", () => {
		it("should return true or false for a single feature", async () => {
			mockFeatures(featureFlags);

			const featureFlagName = featureFlags[0].name;

			const result = await api.post("/api/unleash/" + featureFlagName);
			expect(result.status).toBe(200);
			expect(unleashMock.isEnabled).toHaveBeenCalledTimes(1);
			expect(result.body).toMatchSnapshot();
			expect(result.body[featureFlagName]).toBe(true);
		});

		it("should return true or false for multiple features", async () => {
			mockFeatures(featureFlags);

			const result = await api.post("/api/unleash/" + featureFlags.map(f => f.name).join(","));
			expect(unleashMock.isEnabled).toHaveBeenCalledTimes(featureFlags.length);
			expect(result.body).toMatchSnapshot();
			expect(result.status).toBe(200);
		});

		it("should return an empty list for no passed flags", async () => {
			mockFeatures(featureFlags);

			const result = await api.post("/api/unleash/");
			expect(unleashMock.isEnabled).toHaveBeenCalledTimes(0);
			expect(result.body).toMatchSnapshot();
		});
	});

	describe("Given the feature flags don't exist", () => {
		it("should return false for a single feature", async () => {
			mockFeatures([]);

			const featureFlagName = "non-existent-feature";

			const result = await api.post("/api/unleash/" + featureFlagName);
			expect(result.status).toBe(200);
			expect(unleashMock.isEnabled).toHaveBeenCalledTimes(1);
			expect(result.body).toMatchSnapshot();
			expect(result.body[featureFlagName]).toBe(false);
		});

		it("should return false for multiple features", async () => {
			mockFeatures([]);

			const result = await api.post("/api/unleash/" + featureFlags.map(f => f.name).join(","));
			expect(unleashMock.isEnabled).toHaveBeenCalledTimes(featureFlags.length);
			expect(result.status).toBe(200);
			expect(result.body).toMatchSnapshot();
			Object.values(result.body).forEach((f) => {
				expect(f).toBe(false);
			});
		});

	});

	describe("Given the server is healthy", () => {
		it("should return 200 OK", async () => {
			const result = await api.get("/health");
			expect(result.statusCode).toEqual(200);
		});
	});

});