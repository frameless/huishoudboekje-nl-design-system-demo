import {Badge} from "@chakra-ui/react";
import React from "react";
import {Signaal, useGetSignalenQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";

const SignalenBadge = () => {
	const $signalen = useGetSignalenQuery({
		pollInterval: (300 * 1000), // Every 5 minutes
	});

	return (
		<Queryable query={$signalen} loading={false} error={false}>
			{(data) => {
				const signalen: Signaal[] = data.signalen;
				const nActiveSignalen = signalen.filter(s => s.isActive).length;
				return nActiveSignalen > 0 ? (
					<Badge fontSize={"sm"} p={1} colorScheme={"secondary"}>{nActiveSignalen > 99 ? "99+" : nActiveSignalen}</Badge>
				) : null;
			}}
		</Queryable>
	);
};

export default SignalenBadge;