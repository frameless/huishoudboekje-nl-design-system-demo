import {useEffect, useState} from "react";
import useAuth from "./useAuth";

const useFeatureFlag = (feature: string): boolean => {
	const [enabled, setEnabled] = useState<boolean>(false);
	const {user} = useAuth();

	useEffect(() => {
		if (user && feature) {
			fetch(`/api/unleash/${feature}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({userId: user?.email}),
			})
				.then(result => result.json())
				.then(result => setEnabled(result[feature]));
		}

		return () => {
			setEnabled(false);
		}
	}, [feature, user]);

	return enabled;
};

export default useFeatureFlag;