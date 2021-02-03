import {QuestionIcon} from "@chakra-ui/icons";
import {Tooltip} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import UAParser from "ua-parser-js";
import DynamicIcon from "../DynamicIcon";
import RoundIcon from "../Layouts/RoundIcon";

const BrowserIcon = ({userAgent}) => {
	const {t} = useTranslation();
	const browser = new UAParser(userAgent).getBrowser();

	let icon = <QuestionIcon />;

	if (browser.name?.toLowerCase().includes("firefox")) {
		icon = <DynamicIcon name={"firefox"} />;
	}
	else if (browser.name?.toLowerCase().includes("chrome")) {
		icon = <DynamicIcon name={"chrome"} />;
	}
	else if (browser.name?.toLowerCase().includes("safari")) {
		icon = <DynamicIcon name={"safari"} />;
	}

	let tooltipLabel = t("unknownBrowser");
	if (browser.name && browser.version) {
		tooltipLabel = [browser.name, browser.version].join(" ");
	}

	return (
		<Tooltip label={tooltipLabel}>
			<RoundIcon>{icon}</RoundIcon>
		</Tooltip>
	);
};

export default BrowserIcon;