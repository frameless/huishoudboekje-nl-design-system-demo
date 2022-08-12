import {useEffect} from "react";
import useStore from "../store";
import useAuth from "./useAuth";

export const useInitializeFeatureFlags = () => {
	const {user} = useAuth();
	const setFeatureFlags = useStore(store => store.setFeatureFlags);

	useEffect(() => {
		fetch("/api/unleash", {
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then(result => result.json())
			.then(result => {
				const featureFlags = result.features.reduce((list, f) => ({...list, [f.name]: f.enabled}), {});
				setFeatureFlags(featureFlags);
			});
	}, [setFeatureFlags, user]);
};

export const useFeatureFlag = (feature: string): boolean => {
	const featureFlags = useStore(store => store.featureFlags);
	return featureFlags[feature] || false;
};
