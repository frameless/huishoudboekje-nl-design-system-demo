import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {Button, HStack, IconButton, Td, Text, Tr, useDisclosure} from "@chakra-ui/react";
import React, {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Afdeling, Postadres} from "../../generated/graphql";
import {truncateText} from "../../utils/things";
import Alert from "../shared/Alert";
import UpdatePostadresModal from "./UpdatePostadresModal";

type PostadresListItemProps = {
	postadres: Postadres,
	onDelete?: VoidFunction,
	afdeling: Afdeling,
};

const PostadresListItem: React.FC<PostadresListItemProps> = ({postadres, afdeling, onDelete}) => {
	const {t} = useTranslation();
	const deleteAlert = useDisclosure();
	const updatePostadresModal = useDisclosure();
	const editablePreviewRef = useRef<HTMLSpanElement>(null);

	const onConfirmDelete = () => {
		if (onDelete) {
			const tableRow = document.getElementById("postal_address_" + postadres.id);

			if (tableRow) {
				tableRow.style.display = "none";
			}

			onDelete();
			deleteAlert.onClose()
		}
	};

	/* Truncate the length of the text if EditablePreview's value gets too long. */
	useEffect(() => {
		if (editablePreviewRef.current) {
			editablePreviewRef.current.innerText = truncateText(editablePreviewRef.current.innerText, 50);
		}
	});

	return (<>
		{updatePostadresModal.isOpen && <UpdatePostadresModal postadres={postadres} onClose={updatePostadresModal.onClose} afdeling={afdeling} />}
		{deleteAlert.isOpen && (
			<Alert
				title={t("messages.postadressen.deleteTitle")}
				cancelButton={true}
				confirmButton={
					<Button data-test="modalPostaddress.delete" colorScheme={"red"} onClick={onConfirmDelete} ml={3}>
						{t("global.actions.delete")}
					</Button>
				}
				onClose={() => deleteAlert.onClose()}
			>
				{t("messages.postadressen.deleteQuestion")}
			</Alert>
		)}

		<Tr id={"postal_address_"+ postadres.id}>
			<Td>
				<Text>{(postadres.straatnaam || "").length > 0 ? postadres.straatnaam : t("unknown")}</Text>
			</Td>
			<Td>
				<Text>{(postadres.huisnummer || "").length > 0 ? postadres.huisnummer : t("unknown")}</Text>
			</Td>
			<Td>
				<Text>{(postadres.postcode || "").length > 0 ? postadres.postcode : t("unknown")}</Text>
			</Td>
			<Td>
				<Text>{(postadres.plaatsnaam || "").length > 0 ? postadres.plaatsnaam : t("unknown")}</Text>
			</Td>
			<Td isNumeric>
				<HStack justify={"flex-end"}>
					<IconButton size={"sm"} variant={"ghost"} colorScheme={"gray"} icon={<EditIcon />} aria-label={t("global.actions.edit")} onClick={() => updatePostadresModal.onOpen()} />
					{onDelete && (
						<IconButton data-test="departmentPostaddress.delete" icon={<DeleteIcon />} size={"xs"} variant={"ghost"} onClick={() => deleteAlert.onOpen()}
							aria-label={t("global.actions.delete")} />
					)}
				</HStack>
			</Td>
		</Tr>
	</>);
};

export default PostadresListItem;