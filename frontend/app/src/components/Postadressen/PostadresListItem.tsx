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
import {useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Postadres, useUpdatePostadresMutation} from "../../generated/graphql";
import {truncateText} from "../../utils/things";
import useToaster from "../../utils/useToaster";

type PostadresListItemProps = TableRowProps & {
	postadres: Postadres,
	onDelete?: VoidFunction
};

const PostadresListItem: React.FC<PostadresListItemProps> = ({postadres, onDelete, ...props}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const [deleteDialogOpen, toggleDeleteDialog] = useToggle(false);
	const cancelDeleteRef = useRef(null);
	const [updatePostadres] = useUpdatePostadresMutation();

	const onConfirmDeleteDialog = () => {
		if (onDelete) {
			onDelete();
			toggleDeleteDialog(false);
		}
	};
	const onCloseDeleteDialog = () => toggleDeleteDialog(false);

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
		{onDelete && (
			<AlertDialog isOpen={deleteDialogOpen} leastDestructiveRef={cancelDeleteRef} onClose={onCloseDeleteDialog}>
				<AlertDialogOverlay />
				<AlertDialogContent>
					<AlertDialogHeader fontSize={"lg"} fontWeight={"bold"}>{t("messages.postadressen.deleteTitle")}</AlertDialogHeader>
					<AlertDialogBody>{t("messages.postadressen.deleteQuestion")}</AlertDialogBody>
					<AlertDialogFooter>
						<Button ref={cancelDeleteRef} onClick={onCloseDeleteDialog}>{t("global.actions.cancel")}</Button>
						<Button colorScheme={"red"} onClick={onConfirmDeleteDialog} ml={3}>{t("global.actions.delete")}</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		)}

		<Tr {...props}>
			<Td>
				<Editable defaultValue={(postadres.straatnaam || "").length > 0 ? postadres.straatnaam : t("unknown")} flex={1} submitOnBlur={true} onSubmit={value => onSubmit("straatnaam", value)}>
					<Tooltip label={t("global.actions.clickToEdit")} placement={"right"}>
						<EditablePreview ref={editablePreviewRef} />
					</Tooltip>
					<EditableInput name={"postadresId"} id={"postadresId"} />
				</Editable>
			</Td>
			<Td>
				<Editable defaultValue={(postadres.huisnummer || "").length > 0 ? postadres.huisnummer : t("unknown")} flex={1} submitOnBlur={true} onSubmit={value => onSubmit("huisnummer", value)}>
					<EditablePreview />
					<EditableInput />
				</Editable>
			</Td>
			<Td>
				<Editable defaultValue={(postadres.postcode || "").length > 0 ? postadres.postcode : t("unknown")} flex={1} submitOnBlur={true} onSubmit={value => onSubmit("postcode", value)}>
					<EditablePreview />
					<EditableInput />
				</Editable>
			</Td>
			<Td>
				<Editable defaultValue={(postadres.plaatsnaam || "").length > 0 ? postadres.plaatsnaam : t("unknown")} flex={1} submitOnBlur={true} onSubmit={value => onSubmit("plaatsnaam", value)}>
					<EditablePreview />
					<EditableInput />
				</Editable>
			</Td>
			<Td>
				{onDelete && (
					<IconButton icon={<DeleteIcon />} size={"xs"} variant={"ghost"} onClick={() => toggleDeleteDialog(true)} aria-label={t("global.actions.delete")} />
				)}
			</Td>
		</Tr>
	</>);
};

export default PostadresListItem;