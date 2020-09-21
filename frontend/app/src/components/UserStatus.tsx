import React from "react";
import {Avatar, Box, BoxProps, Stack, Text} from "@chakra-ui/core";

const UserStatus: React.FC<BoxProps & { name: string, role: string }> = ({name, role, ...props}) => {
	return (
		<Stack spacing={5} direction={"row"} alignItems={"center"} {...props}>
			<Avatar name={name} bg={"secondary.100"} />
			<Box>
				<Text fontWeight="bold">{name}</Text>
				<Text fontSize="sm">{role}</Text>
			</Box>
		</Stack>
	);
};

export default UserStatus;