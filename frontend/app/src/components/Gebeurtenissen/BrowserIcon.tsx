import {QuestionIcon} from "@chakra-ui/icons";
import {Tooltip} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {FaChrome, FaFirefox, FaSafari} from "react-icons/all";
import UAParser from "ua-parser-js";
import RoundIcon from "../Layouts/RoundIcon";

const BrowserIcon = ({userAgent}) => {
	const {t} = useTranslation();
	const browser = new UAParser(userAgent).getBrowser();

	let icon = <QuestionIcon />;

	if (browser.name?.toLowerCase().includes("firefox")) {
		icon = <FaFirefox />;
	}
	else if (browser.name?.toLowerCase().includes("chrome")) {
		icon = <FaChrome />;
	}
	else if (browser.name?.toLowerCase().includes("safari")) {
		icon = <FaSafari />;
	}

	let tooltipLabel = t("Onbekende browser");
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