import {Avatar, Stack, Text} from "@chakra-ui/react";
import React from "react";

type UserStatusProps = {
	name: string,
	role?: string
};

const UserStatus: React.FC<UserStatusProps> = ({name, role}) => {
	return (
		<Stack spacing={5} direction={"row"} alignItems={"center"}>
			<Avatar name={name} bg={"primary.100"} />
			<Stack alignItems={"flex-start"} spacing={0}>
				<Text fontWeight={"bold"}>{name}</Text>
				{role && <Text fontSize={"sm"}>{role}</Text>}
			</Stack>
		</Stack>
	);
};

export default UserStatus;