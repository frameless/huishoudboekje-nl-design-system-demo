import {AddIcon} from "@chakra-ui/icons";
import {Button, ButtonProps} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";

type AddButtonProps = ButtonProps & {
	onClick?: VoidFunction,
	// Todo: replace any with actual type
	children?: any
};

const AddButton: React.FC<AddButtonProps> = ({onClick, children, ...props}) => {
	const {t} = useTranslation();

	return (
		<Button leftIcon={<AddIcon />} colorScheme={"primary"} size={"sm"} onClick={onClick} {...props}>
			{children || t("global.actions.add")}
		</Button>
	);
};

export default AddButton;