import {useCallback, useEffect, useMemo, useState} from "react";
import {useToggle} from "react-grapple";
import Store from "../config/store";

type IUser = {
	email: string,
	fullName: string,
	role: string,
}

export const useStore = () => {
	return Store;
};

export const useSession = () => {
	const store = useStore();
	return store.session;
};

export const useAuth = () => {
	const [user, setUser] = useState<IUser>();
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
		fetch("/api/me")
			.then(result => result.json())
			.then(result => {
				const {email} = result;

				if (email) {
					setUser({
						email: "koen.brouwer@vng.nl",
						fullName: "Koen Brouwer",
						role: "VNG Realisatie"
					});
				}

				toggleLoading(false);
			})
			.catch(err => {
				console.error(err);
				setError(true);
				toggleLoading(false);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	return useMemo(() => ({
		user, error, loading, reset
	}), [user, error, loading, reset]);
};