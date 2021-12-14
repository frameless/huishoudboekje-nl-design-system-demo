import React, {createContext, Dispatch, useContext, useEffect, useState} from "react";
import useAuth from "./useAuth";

type FeatureContextValue = {
	features: Record<string, boolean>,
	setFeatures: Record<string, boolean> | Dispatch<Record<string, boolean>>,
};
const FeatureContext = createContext<FeatureContextValue>({
	features: {}, setFeatures: () => ({}),
});

export const FeatureProvider = ({flags, children}) => {
	const [features, setFeatures] = useState<Record<string, boolean>>({});
	const {user} = useAuth();

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
				setFeatures(result);
			});
	}, [setFeatures, user, flags]);

	return (
		<FeatureContext.Provider value={{features, setFeatures}}>
			{children}
		</FeatureContext.Provider>
	);
};

export const useFeatureFlag = (feature: string): boolean => {
	return (useContext(FeatureContext).features)[feature] || false;
};