import React, {useContext, useState} from "react";

export type UseRoute = [
	string,
	(route: string) => void
];

export const RouteContext = React.createContext<UseRoute>(["/", () => void (0)]);

export const useRoute = (): UseRoute => {
	const [route, setRoute] = useContext(RouteContext);

	return [
		route,
		setRoute,
	];
};

export const Routes = ({children}) => {
	const [route, setRoute] = useState<string>("/");

	return (
		<RouteContext.Provider value={[route, setRoute]}>
			{children}
		</RouteContext.Provider>
	);
};

export const NavLink: React.FC<any> = ({to, children, ...props}) => {
	const [, setRoute] = useRoute();

	return (
		<div onClick={() => setRoute(to)} {...props}>
			{children}
		</div>
	);
};

export const Route = ({path, component}) => {
	const [route] = useRoute();
	return path === route ? component : null;
};