import React from "react";
import {Avatar, BoxProps, Stack, Text} from "@chakra-ui/core";
import {useIsMobile} from "react-grapple";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {IGebruiker} from "../../models";

// const NotificationBadge = ({children}) => {
// 	const size = "1.4em";
// 	const offsetFromTopRight = -3;
//
// 	return (
// 		<Flex justifyContent={"center"} alignItems={"center"} bg={"red.500"} color={"white"} fontSize={"sm"} position={"absolute"} top={offsetFromTopRight}
// 		      right={offsetFromTopRight} w={size} h={size} borderRadius={"100%"}>{children}</Flex>
// 	);
// }

const GebruikerCard: React.FC<BoxProps & { gebruiker: IGebruiker, showBadge?: boolean }> = ({gebruiker, showBadge = false, ...props}) => {
	const name = `${gebruiker.burger.voornamen} ${gebruiker.burger.achternaam}`;
	const {push} = useHistory();
	const isMobile = useIsMobile(450);

	const onClick = () => {
		push(Routes.Citizen(gebruiker.id))
	};

	return (
		<Stack direction={"row"} width={"100%"} justifyContent={isMobile ? "flex-start" : "center"} alignItems={"center"} bg={"white"} borderRadius={10} p={5} cursor={"pointer"}
		       onClick={onClick} userSelect={"none"}>
			<Stack direction={isMobile ? "row" : "column"} spacing={5} alignItems={"center"}>
				<Avatar name={name}>
					{/*{showBadge && gebruiker.notifications && (*/}
					{/*	<NotificationBadge>{gebruiker.notifications}</NotificationBadge>*/}
					{/*)}*/}
				</Avatar>
				<Text fontSize={"md"} {...!isMobile && {textAlign: "center"}}><strong>{name}</strong></Text>
			</Stack>
		</Stack>
	);
};

export default GebruikerCard;