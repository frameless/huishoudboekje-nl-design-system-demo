import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {Button, HStack, IconButton, Td, Text, Tr, useDisclosure} from "@chakra-ui/react";
import React, {useEffect, useRef} from "react";
import {Trans, useTranslation} from "react-i18next";
import {Afdeling, Burger, Rekening} from "../../generated/graphql";
import {formatIBAN, truncateText} from "../../utils/things";
import Alert from "../shared/Alert";
import PrettyIban from "../shared/PrettyIban";
import UpdateAfdelingRekeningModal from "./UpdateAfdelingRekeningModal";

type RekeningListItemProps = {
	rekening: Rekening,
	onDelete?: VoidFunction,
	afdeling?: Afdeling,
	burger?: Burger
};

const RekeningListItem: React.FC<RekeningListItemProps> = ({rekening, onDelete, afdeling, burger}) => {
	const {t} = useTranslation();
	const deleteAlert = useDisclosure();
	const updateAfdelingRekeningModal = useDisclosure();
	const editablePreviewRef = useRef<HTMLSpanElement>(null);

	const onConfirmDeleteDialog = () => {
		if (onDelete) {
			onDelete();
			deleteAlert.onClose()
		}
	};
	const onCloseDeleteDialog = () => deleteAlert.onClose();

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
		{updateAfdelingRekeningModal.isOpen && <UpdateAfdelingRekeningModal rekening={rekening} onClose={updateAfdelingRekeningModal.onClose} afdeling={afdeling} burger={burger}/>}
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

		<Tr id={"bank_account_"+rekening.id}>
			<Td>
				<Text>{(rekening.rekeninghouder || "").length > 0 ? rekening.rekeninghouder : t("unknown")}</Text>
			</Td>
			<Td>
				<PrettyIban iban={rekening.iban} />
			</Td>
			<Td isNumeric>
				<HStack justify={"flex-end"}>
					<IconButton size={"sm"} variant={"ghost"} colorScheme={"gray"} icon={<EditIcon />} aria-label={t("global.actions.edit")} onClick={() => updateAfdelingRekeningModal.onOpen()} />
					{onDelete && (
						<IconButton icon={<DeleteIcon />} size={"xs"} variant={"ghost"} onClick={() => deleteAlert.onOpen()} aria-label={t("global.actions.delete")} />
					)}
				</HStack>
			</Td>
		</Tr>
	</>);
};

export default RekeningListItem;