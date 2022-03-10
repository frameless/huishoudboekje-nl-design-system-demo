import {useEffect} from "react";
import {useStore} from "../store";
import useAuth from "./useAuth";

export const useInitializeFeatureFlags = (flags: string[]) => {
	const {user} = useAuth();
	const {updateStore} = useStore();

	useEffect(() => {
		fetch(`/api/unleash/${flags.join(",")}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({userId: user?.email}),
		})
			.then(result => result.json())
			.then(result => {
				updateStore("featureFlags", result);
			});
	}, [updateStore, user, flags]);
};

export const useFeatureFlag = (feature: string): boolean => {
	const {store} = useStore();
	const ff = store.featureFlags;
	return ff[feature] || false;
};