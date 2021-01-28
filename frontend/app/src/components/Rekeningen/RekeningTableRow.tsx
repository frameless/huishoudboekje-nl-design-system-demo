import {CloseIcon} from "@chakra-ui/icons";
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
	Tr,
	useToast
} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useInput, useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Rekening, useUpdateRekeningMutation} from "../../generated/graphql";
import {formatIBAN} from "../../utils/things";
import PrettyIban from "../Layouts/PrettyIban";

type RekeningTableRowProps = TableRowProps & {
	rekening: Rekening,
	onDelete?: VoidFunction
};

const RekeningTableRow: React.FC<RekeningTableRowProps> = ({rekening, onDelete, ...props}) => {
	const {t} = useTranslation();
	const toast = useToast();
	const [deleteDialogOpen, toggleDeleteDialog] = useToggle(false);
	const cancelDeleteRef = useRef(null);

	// const iban = useInput({
	// 	defaultValue: rekening.iban
	// });
	const rekeninghouder = useInput({
		defaultValue: rekening.rekeninghouder,
	});

	const [updateRekening] = useUpdateRekeningMutation();

	const onConfirmDeleteDialog = () => {
		if (onDelete) {
			onDelete();
			toggleDeleteDialog(false);
		}
	}
	const onCloseDeleteDialog = () => toggleDeleteDialog(false);

	const onSubmit = () => {
		updateRekening({
			variables: {
				id: rekening.id!,
				iban: rekening.iban,
				rekeninghouder: rekeninghouder.value,
			}
		}).then(() => {
			toast({
				status: "success",
				title: t("messages.rekening.updateSuccess"),
				position: "top",
			});
		});
	}

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
					<EditablePreview />
					<EditableInput {...rekeninghouder.bind} name={"rekeningId"} id={"rekeningId"} />
				</Editable>
			</Td>
			<Td>
				<PrettyIban iban={rekening.iban} />
			</Td>
			<Td>{onDelete && (
				<IconButton icon={<CloseIcon />} size={"sm"} onClick={() => toggleDeleteDialog(true)} aria-label={t("actions.delete")} />
			)}</Td>
		</Tr>
	</>);
}

export default RekeningTableRow;