import {useQuery} from "@tanstack/react-query";
import useStore from "../store";

type Feature = {
	name: string
	enabled: boolean
};

type FetchResult = {
	features: Feature[]
}

export const useInitializeFeatureFlags = () => {
	const setFeatureFlags = useStore(store => store.setFeatureFlags);

	useQuery<FetchResult, Error>(["getFeatureFlags"], () => {
		return fetch("/api/unleash", {
			headers: {
				"Content-Type": "application/json",
			},
		}).then(result => {
			if (result.status !== 200) {
				throw new Error("Unleashservice not available. Some features may be unavailable.");
			}

			return result.json();
		}).then(data => {
			const featureFlags = data.features.reduce((list, f) => ({
				...list, [f.name]: f.enabled,
			}), {});

			setFeatureFlags(featureFlags);

			return data;
		}).catch(err => {
			console.warn(err.message);
		});
	});
};

export const useFeatureFlag = (feature: string): boolean => {
	const featureFlags = useStore(store => store.featureFlags);
	return featureFlags[feature] || false;
};
