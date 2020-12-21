import {CloseIcon} from "@chakra-ui/icons";
import {AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonProps, Tooltip} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Rekening} from "../../generated/graphql";
import {formatIBAN} from "../../utils/things";
import PrettyIban from "../Layouts/PrettyIban";

type RekeningListItemProps = Omit<ButtonProps, "children">;
const RekeningListItem: React.FC<RekeningListItemProps & { rekening: Rekening, onDelete?: VoidFunction }> = ({rekening, onDelete, ...props}) => {
	const {t} = useTranslation();
	const [deleteDialogOpen, toggleDeleteDialog] = useToggle(false);
	const cancelDeleteRef = useRef(null);

	const onConfirmDeleteDialog = () => {
		if (onDelete) {
			onDelete();
			toggleDeleteDialog(false);
		}
	}
	const onCloseDeleteDialog = () => toggleDeleteDialog(false);

	if (!rekening) {
		return null;
	}

	return (<>
		{onDelete && (
			<AlertDialog isOpen={deleteDialogOpen} leastDestructiveRef={cancelDeleteRef} onClose={onCloseDeleteDialog}>
				<AlertDialogOverlay />
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">{t("messages.rekeningen.deleteTitle")}</AlertDialogHeader>
					<AlertDialogBody>{t("messages.rekeningen.deleteQuestion", {iban: formatIBAN(rekening.iban), accountHolder: rekening.rekeninghouder})}</AlertDialogBody>
					<AlertDialogFooter>
						<Button ref={cancelDeleteRef} onClick={onCloseDeleteDialog}>{t("actions.cancel")}</Button>
						<Button colorScheme="red" onClick={onConfirmDeleteDialog} ml={3}>{t("actions.delete")}</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		)}

		<Tooltip aria-label={rekening.rekeninghouder} label={rekening.rekeninghouder} placement={"top"} hasArrow={true}>
			<Button size={"sm"} mb={2} mr={2} {...props}>
				<PrettyIban iban={rekening.iban} />
				{onDelete && <CloseIcon onClick={() => toggleDeleteDialog(true)} ml={2} w={"12px"} h={"12px"} />}
			</Button>
		</Tooltip>
	</>)
}


export default RekeningListItem;