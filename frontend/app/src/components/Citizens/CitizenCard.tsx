import React from "react";
import {Avatar, BoxProps, Flex, Heading, Stack, Text} from "@chakra-ui/core";
import Routes from "../../config/routes";
import {useHistory} from "react-router-dom";

const NotificationBadge = ({children}) => {
	const size = "1.4em";
	const offsetFromTopRight = -3;

	return (
		<Flex justifyContent={"center"} alignItems={"center"} bg={"red.500"} color={"white"} fontSize={"sm"} position={"absolute"} top={offsetFromTopRight} right={offsetFromTopRight} w={size} h={size} borderRadius={"100%"}>{children}</Flex>
	);
}

const CitizenCard: React.FC<BoxProps & { citizen }> = ({citizen, ...props}) => {
	const name = `${citizen.firstName} ${citizen.lastName}`;
	const {push} = useHistory();

	return (
		<Stack direction={"row"} width={"100%"} justifyContent={"space-between"} alignItems={"center"} bg={"white"} borderRadius={10} p={5}
		       onClick={() => push(Routes.Citizen(citizen.id))} {...props}>
			<Stack direction={"row"} spacing={5} alignItems={"center"}>
				<Avatar name={name}>
					{citizen.notifications && (
						<NotificationBadge>{citizen.notifications}</NotificationBadge>
					)}
				</Avatar>
				<Heading size={"sm"}>{name}</Heading>
			</Stack>
			<Text textAlign={"right"} color={"gray.500"} fontSize={"md"}>
				{Intl.NumberFormat("nl-NL", {style: "currency", currency: "EUR", minimumFractionDigits: 2}).format(citizen.balance)}
			</Text>
		</Stack>
	);
};

export default CitizenCard;