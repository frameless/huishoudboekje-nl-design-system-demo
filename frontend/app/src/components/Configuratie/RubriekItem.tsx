import {Editable, EditableInput, EditablePreview, HStack, Stack, Td, Text, Tooltip, Tr} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {GetRubriekenDocument, Rubriek, useDeleteRubriekMutation, useUpdateRubriekMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import DeleteConfirmButton from "../shared/DeleteConfirmButton";

const RubriekItem: React.FC<{rubriek: Rubriek}> = ({rubriek}) => {
	const toast = useToaster();
	const {t} = useTranslation();
	const [value, setValue] = useState(rubriek.naam);
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

	const onDelete = () => {
		if (!rubriek?.id) {
			return;
		}

		deleteRubriek({
			variables: {
				id: rubriek.id,
			},
		}).then(() => {
			toast.closeAll();
			toast({
				success: t("messages.rubrieken.deleteSuccess"),
			});
		}).catch(err => {
			toast({
				error: err.message,
			});
		});
	};

	const onFocus = () => {
		setSubmitted(false);
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
					<DeleteConfirmButton onConfirm={() => onDelete()} />
				</HStack>
			</Td>
		</Tr>
	);
};

export default RubriekItem;