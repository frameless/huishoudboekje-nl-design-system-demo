import {Box, Button} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {MdArrowBack} from "react-icons/all";
import {useHistory} from "react-router-dom";

const BackButton: React.FC<{ to: string, label?: string }> = ({to, label}) => {
	const {push} = useHistory();
	const {t} = useTranslation();

	return (
		<Button variant={"link"} colorScheme={"gray"} fontSize={"sm"} mb={3} onClick={() => push(to)}>
			<Box as={MdArrowBack} size={"16px"} mr={2} />
			{label || t("actions.back")}
		</Button>
	);
};

export default BackButton;