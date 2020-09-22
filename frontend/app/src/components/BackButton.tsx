import React from "react";
import {Button, Icon} from "@chakra-ui/core";
import {MdArrowBack} from "react-icons/all";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";

const BackButton: React.FC<{ to: string }> = ({to}) => {
	const {push} = useHistory();
	const {t} = useTranslation();

	return (
		<Button variant={"link"} variantColor={"gray"} fontSize={"sm"} mb={5} onClick={() => push(to)}>
			<Icon as={MdArrowBack} size={"16px"} mr={2} />
			{t("back")}
		</Button>
	);
};

export default BackButton;