import {useQuery} from "@tanstack/react-query";
import {useCallback, useMemo} from "react";
import {useTranslation} from "react-i18next";

type User = {
	name: string,
	email: string,
}

export const AuthRoutes = {
	check: "/auth/me",
	login: "/auth/login",
	logout: "/auth/logout",
};

const useAuth = () => {
	const handleAuthResponse = useHandleAuthResponse();
	const {isLoading, data: user, error} = useQuery<User, Error>(["getUser"], () => {
		return fetch(AuthRoutes.check)
			.then(handleAuthResponse)
			.then(result => result.user ?? null);
	});

	const login = useCallback(() => {
		window.location.href = AuthRoutes.login;
	}, []);

	const logout = useCallback(() => {
		window.location.href = AuthRoutes.logout;
	}, []);

	return useMemo(() => ({
		user,
		error,
		loading: isLoading,
		reset: logout,
		login,
	}), [user, error, isLoading, logout, login]);
};

const useHandleAuthResponse = () => {
	const {t} = useTranslation();

	return async (response: Response) => {
		// If the authservice was not found, it's probably not running.
		if (response.status === 404 || response.status === 503) {
			throw new Error(t("authErrors.authServiceNotFound"));
		}
		// If we get a 401 the authservice is up and running, but we're not logged in. That's fine.
		else if (response.status === 401) {
			return await response.json();
		}
		// If we get a 200 the authservice might still not be there. See below.
		else if (response.status === 200) {
			try {
				// If this works, the response contains JSON with a valid user and the frontend can handle it.
				return await response.json();
			}
			catch (err) {
				// If the response doesn't contain valid JSON probably the Ingress/Route to the authservice is not configured and we get the frontend itself as the response.
				throw new Error(t("authErrors.authServiceNotFound"));
			}
		}
		// If the authservice returns something else, there's something wrong with the authservice itself.
		else {
			throw new Error(t("authErrors.authServiceServerError"));
		}
	};
};

export default useAuth;
