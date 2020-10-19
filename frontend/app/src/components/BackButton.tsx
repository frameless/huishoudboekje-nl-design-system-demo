import React from "react";
import {Button, Icon} from "@chakra-ui/core";
import {MdArrowBack} from "react-icons/all";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";

const BackButton: React.FC<{ to: string, label?: string }> = ({to, label}) => {
	const {push} = useHistory();
	const {t} = useTranslation();

	return (
		<Button variant={"link"} variantColor={"gray"} fontSize={"sm"} mb={5} onClick={() => push(to)}>
			<Icon as={MdArrowBack} size={"16px"} mr={2} />
			{label || t("actions.back")}
		</Button>
	);
};

export default BackButton;