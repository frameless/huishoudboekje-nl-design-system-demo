import {CheckIcon, CloseIcon, DeleteIcon} from "@chakra-ui/icons";
import {Editable, EditableInput, EditablePreview, HStack, IconButton, Stack, Td, Text, Tooltip, Tr} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {GetRubriekenDocument, Rubriek, useDeleteRubriekMutation, useUpdateRubriekMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";

const RubriekItem: React.FC<{rubriek: Rubriek}> = ({rubriek}) => {
	const toast = useToaster();
	const {t} = useTranslation();
	const [value, setValue] = useState(rubriek.naam);
	const [deleteConfirm, setDeleteConfirm] = useState(false);
	const [isSubmitted, setSubmitted] = useState(false);
	const onChange = (e) => {
		setValue(e.target.value);
	};

	const [updateRubriek] = useUpdateRubriekMutation({
		refetchQueries: [
			{query: GetRubriekenDocument},
		],
	});
	const [deleteRubriek] = useDeleteRubriekMutation({
		variables: {
			id: rubriek.id!,
		},
		refetchQueries: [
			{query: GetRubriekenDocument},
		],
	});

	const onSubmit = () => {
		if (isSubmitted) {
			return false;
		}

		const grootboekrekeningId = rubriek.grootboekrekening?.id;

		if (!grootboekrekeningId) {
			return false;
		}

		updateRubriek({
			variables: {
				id: rubriek.id!,
				naam: String(value),
				grootboekrekeningId,
			},
		}).then(() => {
			setSubmitted(true);
			toast({
				success: t("messages.rubrieken.updateSuccess"),
			});
		});
	};

	const onClickDelete = () => {
		if (deleteConfirm) {
			onDelete();
		}
		else {
			setDeleteConfirm(true);
		}
	};

	const onDelete = () => {
		deleteRubriek().then(result => {
			if (result.data?.deleteRubriek?.ok) {
				setDeleteConfirm(false);
				toast.closeAll();
				toast({
					success: t("messages.rubrieken.deleteSuccess"),
				});
			}
		});
	};

	const onFocus = () => {
		setSubmitted(false);
		setDeleteConfirm(false);
	};

	return (
		<Tr key={rubriek.id}>
			<Td>
				<Tooltip label={rubriek.grootboekrekening?.naam}>
					<Stack spacing={0}>
						<Text>{rubriek.grootboekrekening?.id}</Text>
						<Text fontSize={"sm"}>{rubriek.grootboekrekening?.omschrijving}</Text>
					</Stack>
				</Tooltip>
			</Td>
			<Td>
				<Editable defaultValue={rubriek.naam} flex={1} submitOnBlur={true} onSubmit={onSubmit} onFocus={onFocus}>
					<EditablePreview />
					<EditableInput onChange={onChange} name={rubriek.naam} id={rubriek.naam} />
				</Editable>
			</Td>
			<Td>
				<HStack>
					{deleteConfirm ? (<>
						<IconButton size={"sm"} variant={"solid"} colorScheme={"red"}
							icon={<CheckIcon />} aria-label={t("global.actions.delete")}
							onClick={() => onClickDelete()} />
						<IconButton size={"sm"} variant={"solid"} colorScheme={"gray"}
							icon={<CloseIcon />} aria-label={t("global.actions.cancel")}
							onClick={() => setDeleteConfirm(false)} />
					</>) : (
						<IconButton size={"sm"} variant={"ghost"} colorScheme={"gray"} icon={<DeleteIcon />}
							aria-label={t("global.actions.delete")} onClick={() => setDeleteConfirm(true)} />
					)}
				</HStack>
			</Td>
		</Tr>
	);
};

export default RubriekItem;