import {HStack, Stack, Td, Text, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {FiActivity} from "react-icons/all";
import UAParser from "ua-parser-js";
import {GebruikersActiviteit} from "../../generated/graphql";
import d from "../../utils/dayjs";
import RoundIcon from "../Layouts/RoundIcon";
import AuditLogText from "./AuditLogText";

const GebeurtenisTableRow: React.FC<{gebeurtenis: GebruikersActiviteit}> = ({gebeurtenis: g}) => {
	const {t} = useTranslation();
	const browser = new UAParser(g.meta?.userAgent).getBrowser();
	const os = new UAParser(g.meta?.userAgent).getOS();

	const osLabel = (os.name && os.version) ? `${os.name} ${os.version}` : t("unknownOs");
	const browserLabel = (browser.name && browser.version) ? `${browser.name} ${browser.version}` : t("unknownBrowser");

	return (
		<Tr alignItems={"center"} key={g.id}>
			<Td>
				<HStack>
					<RoundIcon display={["none", null, "flex"]}>
						<FiActivity />
					</RoundIcon>
					<Stack spacing={1}>
						<AuditLogText g={g} />
						<Text fontSize={"sm"} color={"gray.500"}>
							{["#" + g.id, d(g.timestamp).format("LL LT"), osLabel, browserLabel].join(" - ")}
						</Text>
					</Stack>
				</HStack>
			</Td>
		</Tr>
	);
};

export default GebeurtenisTableRow;