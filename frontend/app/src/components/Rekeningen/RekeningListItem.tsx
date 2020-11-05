import React, {useRef} from "react";
import {IRekening} from "../../models";
import {AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonProps, Icon, Tooltip} from "@chakra-ui/core";
import {friendlyFormatIBAN} from "ibantools";
import {useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";

type RekeningListItemProps = Omit<ButtonProps, "children">;
const RekeningListItem: React.FC<RekeningListItemProps & { rekening: IRekening, onDelete?: VoidFunction }> = ({rekening, onDelete, ...props}) => {
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

	return (<>
		{onDelete && (
			<AlertDialog isOpen={deleteDialogOpen} leastDestructiveRef={cancelDeleteRef} onClose={onCloseDeleteDialog}>
				<AlertDialogOverlay />
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">{t("messages.rekeningen.deleteTitle")}</AlertDialogHeader>
					<AlertDialogBody>{t("messages.rekeningen.deleteQuestion", {iban: rekening.iban, accountHolder: rekening.rekeninghouder})}</AlertDialogBody>
					<AlertDialogFooter>
						<Button ref={cancelDeleteRef} onClick={onCloseDeleteDialog}>{t("actions.cancel")}</Button>
						<Button variantColor="red" onClick={onConfirmDeleteDialog} ml={3}>{t("actions.delete")}</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		)}

		<Tooltip aria-label={rekening.rekeninghouder} label={rekening.rekeninghouder} placement={"top"} hasArrow={true}>
			<Button size={"sm"} mb={2} mr={2} {...props}>
				{friendlyFormatIBAN(rekening.iban)}
				{onDelete && <Icon name={"close"} onClick={() => toggleDeleteDialog(true)} ml={2} size={"12px"} />}
			</Button>
		</Tooltip>
	</>)
}


export default RekeningListItem;