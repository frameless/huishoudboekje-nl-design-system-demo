import {Circle, HStack, Stack, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";

type ServiceStatus = {
	serviceName: string,
	isAlive: boolean
}

export const ServicesStatus = () => {
	const [services, setServices] = useState<ServiceStatus[]>([]);

	useEffect(() => {
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

		const unleash_service = fetch("/api/unleash/health")
			.then(r => r.text())
			.then(r => [{
				serviceName: "unleash-service",
				isAlive: r === "alive",
			}])
			.catch(() => [{
				serviceName: "unleash-service",
				isAlive: false,
			}]);

		Promise.all([backend, oidc, services, unleash_service])
			.then((result) => {
				setServices([...result].flatMap(r => r));
			});
	}, []);

	return (
		<Stack>
			{services.sort((a, b) => a.serviceName < b.serviceName ? -1 : 1).map(({serviceName, isAlive}) => (
				<HStack key={serviceName}>
					<Circle bg={isAlive ? "green.500" : "red.500"} w={3} h={3} />
					<Text>{serviceName}</Text>
				</HStack>
			))}
		</Stack>
	);
};