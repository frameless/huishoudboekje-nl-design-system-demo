import {Badge, BadgeProps} from "@chakra-ui/react";
import React from "react";

type NumberBadgeProps = BadgeProps & {
	count: number
};

const NumberBadge: React.FC<NumberBadgeProps> = ({count, ...props}) => {
	return (
		<Badge fontSize={"sm"} p={1} colorScheme={"secondary"} {...props}>
			{count > 99 ? "99+" : count}
		</Badge>
	);
};

export default NumberBadge;