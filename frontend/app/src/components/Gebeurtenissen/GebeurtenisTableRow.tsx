import {HStack, Stack, Td, Text, Tooltip, Tr} from "@chakra-ui/react";
import React from "react";
import {FiActivity} from "react-icons/all";
import UAParser from "ua-parser-js";
import {GebruikersActiviteit} from "../../generated/graphql";
import d from "../../utils/dayjs";
import RoundIcon from "../Layouts/RoundIcon";
import AuditLogText from "./AuditLogText";

const GebeurtenisTableRow: React.FC<{gebeurtenis: GebruikersActiviteit}> = ({gebeurtenis: g}) => {
	const browser = new UAParser(g.meta?.userAgent).getBrowser();
	const os = new UAParser(g.meta?.userAgent).getOS();

	return (
		<Tr alignItems={"center"} key={g.id}>
			<Td>
				<Tooltip label={`${g.id}`} placement={"left"} hasArrow>
					<HStack>
						<RoundIcon display={["none", null, "flex"]}>
							<FiActivity />
						</RoundIcon>
						<Stack spacing={1}>
							<AuditLogText g={g} />
							<Text fontSize={"sm"} color={"gray.500"}>
								{d(g.timestamp).format("LL LT")} - {os.name} {os.version} - {browser.name} {browser.version}
							</Text>
						</Stack>
					</HStack>
				</Tooltip>
			</Td>
		</Tr>
	);
};

export default GebeurtenisTableRow;