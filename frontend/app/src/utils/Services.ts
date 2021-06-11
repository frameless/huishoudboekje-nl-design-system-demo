import {useEffect, useState} from "react";

export type ServiceStatus = {
	serviceName: string,
	isAlive: boolean
}

export const useServices = () => {
	const [services, setServices] = useState<ServiceStatus[]>([]);
	const [ready, setReady] = useState<boolean>(false);

	useEffect(() => {
		let isMounted = true;

		const backend = fetch("/api/health")
			.then(r => r.text())
			.then(r => [{
				serviceName: "backend",
				isAlive: r === "ok",
			}])
			.catch(() => [{
				serviceName: "backend",
				isAlive: false,
			}]);

		const oidc = fetch("/api/me")
			.then(r => r.text())
			.then(() => [{
				serviceName: "oidc",
				isAlive: true,
			}])
			.catch(() => [{
				serviceName: "oidc",
				isAlive: false,
			}]);

		const services = fetch("/api/services_health")
			.then(r => r.json())
			.then(r => Object.keys(r).map(service => ({
				serviceName: service,
				isAlive: r[service] === "up",
			})))
			.catch(() => [{
				serviceName: "services",
				isAlive: false,
			}]);

		const unleashService = fetch("/api/unleash/health")
			.then(r => r.text())
			.then(r => [{
				serviceName: "unleash-service",
				isAlive: r === "alive",
			}])
			.catch(() => [{
				serviceName: "unleash-service",
				isAlive: false,
			}]);

		Promise.all([backend, oidc, services, unleashService])
			.then((result) => {
				if (isMounted) {
					setServices([...result].flatMap(r => r));
					setReady(true);
				}
			});

		return () => {
			isMounted = false;
		};
	}, []);

	return {
		services,
		allAvailable: ready && services.length > 0 && services.every(s => s.isAlive === true),
	};
};

export const ServicesProvider: React.FC<{fallback, children}> = ({fallback, children}) => {
	const {allAvailable} = useServices();
	return allAvailable ? children : fallback;
};