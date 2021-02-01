import {QuestionIcon} from "@chakra-ui/icons";
import {Tooltip} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {FaApple, FaLinux, FaWindows} from "react-icons/all";
import UAParser from "ua-parser-js";
import RoundIcon from "../Layouts/RoundIcon";

const OsIcon = ({userAgent}) => {
	const {t} = useTranslation();
	const os = new UAParser(userAgent).getOS();
	let icon = <QuestionIcon />;

	if (os.name?.toLowerCase().includes("windows")) {
		icon = <FaWindows />;
	}
	else if (os.name?.toLowerCase().includes("mac")) {
		icon = <FaApple />;
	}
	else if (os.name?.toLowerCase().includes("linux")) {
		icon = <FaLinux />;
	}

	let tooltipLabel = t("Onbekend besturingssysteem");
	if (os.name && os.version) {
		tooltipLabel = [os.name, os.version].join(" ");
	}

	return (
		<Tooltip label={tooltipLabel}>
			<RoundIcon>{icon}</RoundIcon>
		</Tooltip>
	);
};

export default OsIcon;