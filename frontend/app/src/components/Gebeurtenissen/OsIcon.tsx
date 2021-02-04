import {QuestionIcon} from "@chakra-ui/icons";
import {Tooltip} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import UAParser from "ua-parser-js";
import DynamicIcon from "../DynamicIcon";
import RoundIcon from "../Layouts/RoundIcon";

const OsIcon = ({userAgent}) => {
	const {t} = useTranslation();
	const os = new UAParser(userAgent).getOS();
	let icon = <QuestionIcon />;

	if (os.name?.toLowerCase().includes("windows")) {
		icon = <DynamicIcon name={"windows"} />;
	}
	else if (os.name?.toLowerCase().includes("mac")) {
		icon = <DynamicIcon name={"apple"} />;
	}
	else if (os.name?.toLowerCase().includes("linux")) {
		icon = <DynamicIcon name={"linux"} />;
	}

	let tooltipLabel = t("unknownOperatingSystem");
	if (os.name && os.version) {
		tooltipLabel = [os.name, os.version].join(" ");
	}

	return (
		<Tooltip label={tooltipLabel}>
			<RoundIcon border={"none"}>{icon}</RoundIcon>
		</Tooltip>
	);
};

export default OsIcon;