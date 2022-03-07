import {DeleteIcon} from "@chakra-ui/icons";
import {Button, Editable, EditableInput, EditablePreview, IconButton, Td, Tooltip, Tr, useDisclosure} from "@chakra-ui/react";
import React, {useEffect, useRef} from "react";
import {Trans, useTranslation} from "react-i18next";
import {GetRekeningDocument, Rekening, useUpdateRekeningMutation} from "../../generated/graphql";
import {formatIBAN, truncateText} from "../../utils/things";
import useForm from "../../utils/useForm";
import useToaster from "../../utils/useToaster";
import Alert from "../shared/Alert";
import PrettyIban from "../shared/PrettyIban";

type RekeningListItemProps = {
	rekening: Rekening,
	onDelete?: VoidFunction
};

const RekeningListItem: React.FC<RekeningListItemProps> = ({rekening, onDelete}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const deleteAlert = useDisclosure();
	const editablePreviewRef = useRef<HTMLSpanElement>(null);
	const [form, {updateForm}] = useForm({
		initialValue: {
			rekeninghouder: rekening.rekeninghouder,
		},
	});

	const [updateRekening] = useUpdateRekeningMutation({
		refetchQueries: [
			{query: GetRekeningDocument, variables: {id: rekening.id!}},
		],
	});

	const onConfirmDeleteDialog = () => {
		if (onDelete) {
			onDelete();
		}
	};
	const onCloseDeleteDialog = () => deleteAlert.onClose();

	const onSubmit = () => {
		updateRekening({
			variables: {
				id: rekening.id!,
				iban: rekening.iban,
				rekeninghouder: form.rekeninghouder,
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

		{deleteAlert.isOpen && (
			<Alert
				title={t("messages.rekeningen.deleteTitle")}
				cancelButton={true}
				confirmButton={
					<Button colorScheme={"red"} onClick={onConfirmDeleteDialog} ml={3}>
						{t("global.actions.delete")}
					</Button>
				}
				onClose={onCloseDeleteDialog}
			>
				<Trans i18nKey={"messages.rekeningen.deleteQuestion"} values={{
					iban: formatIBAN(rekening.iban),
					rekeninghouder: rekening.rekeninghouder,
				}} components={{
					strong: <strong />,
				}} />
			</Alert>)
		}

		<Tr>
			<Td>
				<Editable defaultValue={(rekening.rekeninghouder || "").length > 0 ? rekening.rekeninghouder : t("unknown")} flex={1} submitOnBlur={true} onSubmit={onSubmit}>
					<Tooltip label={t("global.actions.clickToEdit")} placement={"right"}>
						<EditablePreview ref={editablePreviewRef} />
					</Tooltip>
					<EditableInput value={form.rekeninghouder || ""} onChange={e => updateForm("rekeninghouder", e.target.value)} name={"rekeningId"} id={"rekeningId"} />
				</Editable>
			</Td>
			<Td>
				<PrettyIban iban={rekening.iban} />
			</Td>
			<Td>{onDelete && (
				<IconButton icon={<DeleteIcon />} size={"xs"} variant={"ghost"} onClick={() => deleteAlert.onOpen()} aria-label={t("global.actions.delete")} />
			)}</Td>
		</Tr>
	</>);
};

export default RekeningListItem;