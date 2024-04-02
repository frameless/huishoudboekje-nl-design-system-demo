import {HStack, Stack, Td, Text, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {FiActivity} from "react-icons/fi";
import UAParser from "ua-parser-js";
import {UserActivityData} from "../../generated/graphql";
import d from "../../utils/dayjs";
import RoundIcon from "../shared/RoundIcon";
import AuditLogText from "./AuditLogText";

const GebeurtenisTableRow: React.FC<{gebeurtenis: UserActivityData}> = ({gebeurtenis: g}) => {
	const {t} = useTranslation();
	const browser = new UAParser(g.meta?.userAgent).getBrowser();
	const os = new UAParser(g.meta?.userAgent).getOS();

	const osNameAndVersion = os.name && os.version;
	const browserNameAndVersion = browser.name && browser.version;

	const osLabel = osNameAndVersion ? `${os.name} ${os.version}` : t("unknownOs");
	const browserLabel = browserNameAndVersion ? `${browser.name} ${browser.version}` : t("unknownBrowser");

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
							{["#" + g.id, d.unix(g.timestamp).format("LL LT"), osLabel, browserLabel].join(" - ")}
						</Text>
					</Stack>
				</HStack>
			</Td>
		</Tr>
	);
};

export default GebeurtenisTableRow;
