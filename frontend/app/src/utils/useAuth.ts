import {useCallback, useEffect, useMemo, useState} from "react";

const AuthRoutes = {
	check: "/auth/me",
	login: "/auth/login",
	logout: "/auth/logout",
};

const useAuth = () => {
	const [user, setUser] = useState<{email: string, name: string}>();
	const [error, setError] = useState(false);
	const [loading, toggleLoading] = useState(true);

	const login = useCallback(() => {
		window.location.href = AuthRoutes.login;
	}, []);

	const logout = useCallback(() => {
		window.location.href = AuthRoutes.logout;
	}, []);

	useEffect(() => {
		fetch(AuthRoutes.check)
			.then(result => result.json())
			.then(result => {
				if (result.user) {
					setUser(result.user);
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
		user, error, loading, reset: logout, login,
	}), [user, error, loading, logout, login]);
};

export default useAuth;
