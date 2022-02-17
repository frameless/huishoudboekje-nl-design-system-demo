import {Avatar, Stack, StackProps, Text} from "@chakra-ui/react";
import React from "react";

type UserStatusProps = StackProps & {name: string, role?: string};

const UserStatus: React.FC<UserStatusProps> = ({name, role, ...props}) => {
	return (
		<Stack spacing={5} direction={"row"} alignItems={"center"} {...props}>
			<Avatar name={name} bg={"primary.100"} />
			<Stack alignItems={"flex-start"} spacing={0}>
				<Text fontWeight={"bold"}>{name}</Text>
				{role && <Text fontSize={"sm"}>{role}</Text>}
			</Stack>
		</Stack>
	);
};

export default UserStatus;