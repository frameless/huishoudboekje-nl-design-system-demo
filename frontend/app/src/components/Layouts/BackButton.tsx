import {Box, HStack, Link, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {MdArrowBack} from "react-icons/all";
import {NavLink} from "react-router-dom";

const BackButton: React.FC<{to: string, label?: string}> = ({to, label}) => {
	const {t} = useTranslation();

	return (
		<Link color={"gray.500"} fontSize={"sm"} mb={3} as={NavLink} to={to} d={"inline-block"}>
			<HStack>
				<Box as={MdArrowBack} size={"16px"} />
				<Text>{label || t("actions.back")}</Text>
			</HStack>
		</Link>
	);
};

export default BackButton;