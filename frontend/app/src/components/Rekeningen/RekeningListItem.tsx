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
import React, {useEffect, useRef} from "react";
import {useInput, useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {GetRekeningDocument, Rekening, useUpdateRekeningMutation} from "../../generated/graphql";
import {formatIBAN, truncateText} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import PrettyIban from "../shared/PrettyIban";

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

	const [updateRekening] = useUpdateRekeningMutation({
		refetchQueries: [
			{query: GetRekeningDocument, variables: {id: rekening.id!}},
		],
	});

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
				success: t("messages.rekeningen.updateSuccess"),
			});
		}).catch(err => {
			console.error(err);
			toast({
				error: err.message,
			});
		});
	};

	const editablePreviewRef = useRef<HTMLSpanElement>(null);

	/* Truncate the length of the text if EditablePreview's value gets too long. */
	useEffect(() => {
		if (editablePreviewRef.current) {
			editablePreviewRef.current.innerText = truncateText(editablePreviewRef.current.innerText, 50);
		}
	});


	if (!rekening) {
		return null;
	}

	return (<>
		{onDelete && (
			<AlertDialog isOpen={deleteDialogOpen} leastDestructiveRef={cancelDeleteRef} onClose={onCloseDeleteDialog}>
				<AlertDialogOverlay />
				<AlertDialogContent>
					<AlertDialogHeader fontSize={"lg"} fontWeight={"bold"}>{t("messages.rekeningen.deleteTitle")}</AlertDialogHeader>
					<AlertDialogBody>{t("messages.rekeningen.deleteQuestion", {iban: formatIBAN(rekening.iban), rekeninghouder: rekening.rekeninghouder})}</AlertDialogBody>
					<AlertDialogFooter>
						<Button ref={cancelDeleteRef} onClick={onCloseDeleteDialog}>{t("global.actions.cancel")}</Button>
						<Button colorScheme={"red"} onClick={onConfirmDeleteDialog} ml={3}>{t("global.actions.delete")}</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		)}

		<Tr {...props}>
			<Td>
				<Editable defaultValue={(rekening.rekeninghouder || "").length > 0 ? rekening.rekeninghouder : t("unknown")} flex={1} submitOnBlur={true} onSubmit={onSubmit}>
					<Tooltip label={t("global.actions.clickToEdit")} placement={"right"}>
						<EditablePreview ref={editablePreviewRef} />
					</Tooltip>
					<EditableInput {...rekeninghouder.bind} name={"rekeningId"} id={"rekeningId"} />
				</Editable>
			</Td>
			<Td>
				<PrettyIban iban={rekening.iban} />
			</Td>
			<Td>{onDelete && (
				<IconButton icon={<DeleteIcon />} size={"xs"} variant={"ghost"} onClick={() => toggleDeleteDialog(true)} aria-label={t("global.actions.delete")} />
			)}</Td>
		</Tr>
	</>);
};

export default RekeningListItem;