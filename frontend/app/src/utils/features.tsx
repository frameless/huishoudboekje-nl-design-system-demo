import {useQuery} from "@tanstack/react-query";
import {useEffect} from "react";
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
	const {isLoading, data, error} = useQuery<FetchResult, Error>(["getFeatureFlags"], () => {
		return fetch("/api/unleash", {
			headers: {
				"Content-Type": "application/json",
			},
		}).then(result => result.json());
	});

	useEffect(() => {
		if (!isLoading && !error && data) {
			const featureFlags = data.features.reduce((list, f) => ({...list, [f.name]: f.enabled}), {});
			setFeatureFlags(featureFlags);
		}
	}, [setFeatureFlags, data, error, isLoading]);
};

export const useFeatureFlag = (feature: string): boolean => {
	const featureFlags = useStore(store => store.featureFlags);
	return featureFlags[feature] || false;
};
