import {Circle, HStack, Stack, Text} from "@chakra-ui/react";
import {useServices} from "../../utils/Services";

export const ServicesStatus = () => {
	const {services} = useServices();

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