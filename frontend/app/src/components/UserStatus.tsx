import React from "react";
import {Avatar, BoxProps, Stack, Text} from "@chakra-ui/react";

const UserStatus: React.FC<BoxProps & { name: string, role: string }> = ({name, role, ...props}) => {
	return (
		<Stack spacing={5} direction={"row"} alignItems={"center"} {...props}>
			<Avatar name={name} bg={"primary.100"} />
			<Stack alignItems={"flex-start"} spacing={0}>
				<Text fontWeight="bold">{name}</Text>
				<Text fontSize="sm">{role}</Text>
			</Stack>
		</Stack>
	);
};

export default UserStatus;