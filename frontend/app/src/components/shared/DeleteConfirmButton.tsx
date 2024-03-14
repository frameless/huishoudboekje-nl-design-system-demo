import {CheckIcon, CloseIcon, DeleteIcon} from "@chakra-ui/icons";
import {HStack, IconButton} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";

const DeleteConfirmButton: React.FC<{onConfirm: VoidFunction}> = ({onConfirm}) => {
	const {t} = useTranslation();
	const [isConfirmed, setConfirmed] = useState<boolean>(false);

	return (
		<HStack spacing={1}>
			{!isConfirmed ? (
				<IconButton data-test="button.Delete" size={"sm"} variant={"ghost"} colorScheme={"gray"} icon={<DeleteIcon />} aria-label={t("global.actions.delete")} onClick={() => setConfirmed(true)} />
			) : (<>
				<IconButton data-test="button.Delete" size={"sm"} variant={"solid"} colorScheme={"red"} icon={<CheckIcon />} aria-label={t("global.actions.delete")} onClick={() => {
					setConfirmed(false);
					onConfirm();
				}} />
				<IconButton data-test="button.Cancel" size={"sm"} variant={"ghost"} colorScheme={"gray"} icon={<CloseIcon />} aria-label={t("global.actions.cancel")} onClick={() => setConfirmed(false)} />
			</>)}
		</HStack>
	);
};

export default DeleteConfirmButton;