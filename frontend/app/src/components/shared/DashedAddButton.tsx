import {AddIcon} from "@chakra-ui/icons";
import {Button, ButtonProps} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";

type DashedAddButtonProps = Pick<ButtonProps, "type" | "isLoading" | "isDisabled"> & {
	onClick?: VoidFunction,
	children?: JSX.Element | string
};

const DashedAddButton: React.FC<DashedAddButtonProps> = ({onClick, children}) => {
	const {t} = useTranslation();

	return (
		<Button colorScheme={"primary"} borderStyle={"dashed"} variant={"outline"} leftIcon={<AddIcon />} w={"100%"} h={"100%"} borderRadius={5} p={5} onClick={onClick}>
			{children || t("global.actions.add")}
		</Button>
	);
};

export default DashedAddButton;