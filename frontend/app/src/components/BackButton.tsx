import React from "react";
import {Box, Button, Icon} from "@chakra-ui/react";
import {MdArrowBack} from "react-icons/all";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";

const BackButton: React.FC<{ to: string, label?: string }> = ({to, label}) => {
	const {push} = useHistory();
	const {t} = useTranslation();

	return (
		<Button variant={"link"} colorScheme={"gray"} fontSize={"sm"} mb={5} onClick={() => push(to)}>
			<Box as={MdArrowBack} size={"16px"} mr={2} />
			{label || t("actions.back")}
		</Button>
	);
};

export default BackButton;