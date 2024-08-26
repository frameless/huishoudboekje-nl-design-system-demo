import {AddIcon} from "@chakra-ui/icons";
import {Button, ButtonProps} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";

type AddButtonProps = Pick<ButtonProps, "type" | "isLoading" | "isDisabled"> & {
	onClick?: VoidFunction,
	children?: JSX.Element | string
};

const AddButton: React.FC<AddButtonProps> = ({onClick, children, ...props}) => {
	const {t} = useTranslation();

	return (
		<Button colorScheme={"primary"} size={"sm"} onClick={onClick} {...props}>
			{children || t("global.actions.add")}
		</Button>
	);
};

export default AddButton;