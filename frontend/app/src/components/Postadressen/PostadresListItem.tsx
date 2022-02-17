import {DeleteIcon} from "@chakra-ui/icons";
import {Button, Editable, EditableInput, EditablePreview, IconButton, TableRowProps, Td, Tooltip, Tr, useDisclosure,} from "@chakra-ui/react";
import React, {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Postadres, useUpdatePostadresMutation} from "../../generated/graphql";
import {truncateText} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import Alert from "../shared/Alert";

type PostadresListItemProps = TableRowProps & {
    postadres: Postadres,
    onDelete?: VoidFunction
};

const PostadresListItem: React.FC<PostadresListItemProps> = ({postadres, onDelete, ...props}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const deleteDialog = useDisclosure();
	const [updatePostadres] = useUpdatePostadresMutation();

	const onConfirmDeleteDialog = () => {
		if (onDelete) {
			onDelete();
		}
	};
	const onCloseDeleteDialog = () => deleteDialog.onClose();

	const onSubmit = (field: keyof Postadres, value: any) => {
		updatePostadres({
			variables: {
				id: postadres.id!,
				[field]: value,
			},
		}).then(() => {
			toast({
				success: t("messages.postadressen.updateSuccess"),
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

	if (!postadres) {
		return null;
	}

	return (<>
		{deleteDialog.isOpen && (
			<Alert
				title={t("messages.postadressen.deleteTitle")}
				cancelButton={true}
				confirmButton={
					<Button colorScheme="red" onClick={onConfirmDeleteDialog} ml={3}>
						{t("global.actions.delete")}
					</Button>
				}
				onClose={onCloseDeleteDialog}
			>
				{t("messages.postadressen.deleteQuestion")}
			</Alert>
		)}

		<Tr {...props}>
			<Td>
				<Editable defaultValue={(postadres.straatnaam || "").length > 0 ? postadres.straatnaam : t("unknown")} flex={1} submitOnBlur={true}
					onSubmit={value => onSubmit("straatnaam", value)}>
					<Tooltip label={t("global.actions.clickToEdit")} placement={"right"}>
						<EditablePreview ref={editablePreviewRef} />
					</Tooltip>
					<EditableInput name={"postadresId"} id={"postadresId"} />
				</Editable>
			</Td>
			<Td>
				<Editable defaultValue={(postadres.huisnummer || "").length > 0 ? postadres.huisnummer : t("unknown")} flex={1} submitOnBlur={true}
					onSubmit={value => onSubmit("huisnummer", value)}>
					<EditablePreview />
					<EditableInput />
				</Editable>
			</Td>
			<Td>
				<Editable defaultValue={(postadres.postcode || "").length > 0 ? postadres.postcode : t("unknown")} flex={1} submitOnBlur={true}
					onSubmit={value => onSubmit("postcode", value)}>
					<EditablePreview />
					<EditableInput />
				</Editable>
			</Td>
			<Td>
				<Editable defaultValue={(postadres.plaatsnaam || "").length > 0 ? postadres.plaatsnaam : t("unknown")} flex={1} submitOnBlur={true}
					onSubmit={value => onSubmit("plaatsnaam", value)}>
					<EditablePreview />
					<EditableInput />
				</Editable>
			</Td>
			<Td>
				{onDelete && (
					<IconButton icon={<DeleteIcon />} size={"xs"} variant={"ghost"} onClick={() => deleteDialog.onOpen()}
						aria-label={t("global.actions.delete")} />
				)}
			</Td>
		</Tr>
	</>);
};

export default PostadresListItem;