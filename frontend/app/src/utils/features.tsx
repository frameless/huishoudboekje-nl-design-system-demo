import {useEffect} from "react";
import {useStore} from "../store";
import useAuth from "./useAuth";

export const useInitializeFeatureFlags = () => {
	const {user} = useAuth();
	const {updateStore} = useStore();

	useEffect(() => {
		fetch("/api/unleash", {
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then(result => result.json())
			.then(result => {
				const featureFlags = result.features.map(f => [f.name, f.enabled]);
				updateStore("featureFlags", featureFlags);
			});
	}, [updateStore, user]);
};

export const useFeatureFlag = (feature: string): boolean => {
	const {store} = useStore();
	const ff = store.featureFlags;
	return ff[feature] || false;
};