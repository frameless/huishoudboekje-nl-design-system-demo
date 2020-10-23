import React from "react";
import {BoxProps, Stack, Text} from "@chakra-ui/core";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {IOrganisatie} from "../../models";

const OrganizationCard: React.FC<BoxProps & { organization: IOrganisatie, showBadge?: boolean }> = ({organization, showBadge = false, ...props}) => {
	const {push} = useHistory();

	const onClick = () => push(Routes.Organisatie(organization.id));

	return (
		<Stack direction={"row"} width={"100%"} justifyContent={"flex-start"} alignItems={"center"} bg={"white"} borderRadius={5} p={5} cursor={"pointer"}
		       onClick={onClick} userSelect={"none"} {...props}>
			<Stack direction={"row"} spacing={5} alignItems={"center"} justifyContent={"flex-start"}>
				<Stack direction={"column"} spacing={1}>
					<Text fontSize={"md"}><strong>{organization.weergaveNaam}</strong></Text>
					<Text fontSize={"md"} color={"gray.400"}>{organization.kvkDetails.plaatsnaam}</Text>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default OrganizationCard;