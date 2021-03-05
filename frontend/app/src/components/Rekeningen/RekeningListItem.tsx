import {DeleteIcon} from "@chakra-ui/icons";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	Editable,
	EditableInput,
	EditablePreview,
	IconButton,
	TableRowProps,
	Td,
	Tooltip,
	Tr,
} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useInput, useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Rekening, useUpdateRekeningMutation} from "../../generated/graphql";
import {formatIBAN} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import PrettyIban from "../Layouts/PrettyIban";

type RekeningListItemProps = TableRowProps & {
	rekening: Rekening,
	onDelete?: VoidFunction
};

const RekeningListItem: React.FC<RekeningListItemProps> = ({rekening, onDelete, ...props}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const [deleteDialogOpen, toggleDeleteDialog] = useToggle(false);
	const cancelDeleteRef = useRef(null);

	const rekeninghouder = useInput({
		defaultValue: rekening.rekeninghouder,
	});

	const [updateRekening] = useUpdateRekeningMutation();

	const onConfirmDeleteDialog = () => {
		if (onDelete) {
			onDelete();
			toggleDeleteDialog(false);
		}
	};
	const onCloseDeleteDialog = () => toggleDeleteDialog(false);

	const onSubmit = () => {
		updateRekening({
			variables: {
				id: rekening.id!,
				iban: rekening.iban,
				rekeninghouder: rekeninghouder.value,
			},
		}).then(() => {
			toast({
				success: t("messages.rekening.updateSuccess"),
			});
		}).catch(err => {
			console.error(err);
			toast({
				error: err.message,
			});
		});
	};

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

		<Tr {...props}>
			<Td>
				<Editable defaultValue={rekening.rekeninghouder} flex={1} submitOnBlur={true} onSubmit={onSubmit}>
					<Tooltip label={t("actions.clickToEdit")} placement={"right"}>
						<EditablePreview />
					</Tooltip>
					<EditableInput {...rekeninghouder.bind} name={"rekeningId"} id={"rekeningId"} />
				</Editable>
			</Td>
			<Td>
				<PrettyIban iban={rekening.iban} />
			</Td>
			<Td>{onDelete && (
				<IconButton icon={<DeleteIcon />} size={"xs"} variant={"ghost"} onClick={() => toggleDeleteDialog(true)} aria-label={t("actions.delete")} />
			)}</Td>
		</Tr>
	</>);
};

export default RekeningListItem;