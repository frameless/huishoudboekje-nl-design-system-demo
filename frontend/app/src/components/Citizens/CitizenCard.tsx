import React from "react";
import {Avatar, BoxProps, Flex, Stack, Text} from "@chakra-ui/core";
import Routes from "../../config/routes";
import {useHistory} from "react-router-dom";
import {useIsMobile} from "react-grapple";

const NotificationBadge = ({children}) => {
	const size = "1.4em";
	const offsetFromTopRight = -3;

	return (
		<Flex justifyContent={"center"} alignItems={"center"} bg={"red.500"} color={"white"} fontSize={"sm"} position={"absolute"} top={offsetFromTopRight}
		      right={offsetFromTopRight} w={size} h={size} borderRadius={"100%"}>{children}</Flex>
	);
}

const CitizenCard: React.FC<BoxProps & { citizen, showBadge?: boolean }> = ({citizen, showBadge = false, ...props}) => {
	const name = `${citizen.firstName} ${citizen.lastName}`;
	const {push} = useHistory();
	const isMobile = useIsMobile(450);

	return (
		<Stack direction={"row"} width={"100%"} justifyContent={isMobile ? "flex-start" : "center"} alignItems={"center"} bg={"white"} borderRadius={10} p={5}
		       onClick={() => push(Routes.Citizen(citizen.id))} {...props}>
			<Stack direction={isMobile ? "row" : "column"} spacing={5} alignItems={"center"}>
				<Avatar name={name}>
					{showBadge && citizen.notifications && (
						<NotificationBadge>{citizen.notifications}</NotificationBadge>
					)}
				</Avatar>
				<Text fontSize={"md"} {...!isMobile && {textAlign: "center"}}><strong>{name}</strong></Text>
			</Stack>
		</Stack>
	);
};

export default CitizenCard;