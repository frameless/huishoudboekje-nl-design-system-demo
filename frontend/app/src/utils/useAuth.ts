import {useCallback, useEffect, useMemo, useState} from "react";
import {useToggle} from "react-grapple";
import {isDev} from "./things";

const useAuth = () => {
	const [user, setUser] = useState<{email: string}>();
	const [error, setError] = useToggle(false);
	const [loading, toggleLoading] = useToggle(true);

	const reset = useCallback(() => {
		fetch("/api/logout")
			.then(() => {
				setUser(undefined);
			})
			.catch(err => {
				console.error(err);
				setError(true);
				setUser(undefined);
			});
	}, [setError]);

	useEffect(() => {
		if (isDev) {
			setUser({email: "developer@sloothuizen.nl"});
			toggleLoading(false);
			return;
		}

		fetch("/api/me")
			.then(result => result.json())
			.then(result => {
				if (result.email) {
				}
				toggleLoading(false);
			})
			.catch(err => {
				console.error(err);
				setUser(undefined);
				setError(true);
				toggleLoading(false);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	return useMemo(() => ({
		user, error, loading, reset,
	}), [user, error, loading, reset]);
};

export default useAuth;