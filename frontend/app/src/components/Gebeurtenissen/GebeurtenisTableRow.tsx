import {HStack, Td, Text, Tr, Wrap, WrapItem} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import {FiActivity} from "react-icons/all";
import {GebruikersActiviteit} from "../../generated/graphql";
import RoundIcon from "../Layouts/RoundIcon";
import AuditLogText from "./AuditLogText";
import BrowserIcon from "./BrowserIcon";
import OsIcon from "./OsIcon";

const GebeurtenisTableRow: React.FC<{gebeurtenis: GebruikersActiviteit}> = ({gebeurtenis: g}) => {
	return (
		<Tr alignItems={"center"} key={g.id}>
			<Td>
				<HStack>
					<RoundIcon display={["none", null, "flex"]}>
						<FiActivity />
					</RoundIcon>
					<Wrap spacing={2}>
						<WrapItem><AuditLogText g={g} /></WrapItem>
						<WrapItem><Text fontSize={"sm"} color={"gray.500"}>{moment(g.timestamp).format("L LT")}</Text></WrapItem>
					</Wrap>
				</HStack>
			</Td>
			<Td>
				<HStack>
					<BrowserIcon userAgent={g.meta?.userAgent} />
					<OsIcon userAgent={g.meta?.userAgent} />
				</HStack>
			</Td>
		</Tr>
	);
};

export default GebeurtenisTableRow;