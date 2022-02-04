import {CheckIcon, CloseIcon, DeleteIcon} from "@chakra-ui/icons";
import {Editable, EditableInput, EditablePreview, FormControlProps, HStack, IconButton, Td, Tr} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Configuratie as IConfiguratie, GetConfiguratieDocument, useDeleteConfiguratieMutation, useUpdateConfiguratieMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";

const ParameterItem: React.FC<FormControlProps & {c: IConfiguratie}> = ({c, ...props}) => {
	const toast = useToaster();
	const {t} = useTranslation();
	const [value, setValue] = useState(c.waarde);
	const [deleteConfirm, setDeleteConfirm] = useState(false);
	const [isSubmitted, setSubmitted] = useState(false);
	const onChange = (e) => {
		setValue(e.target.value);
	};

	const [updateConfig] = useUpdateConfiguratieMutation({
		refetchQueries: [
			{query: GetConfiguratieDocument},
		],
	});
	const [deleteConfig] = useDeleteConfiguratieMutation({
		variables: {
			key: String(c.id),
		},
		refetchQueries: [
			{query: GetConfiguratieDocument},
		],
	});

	const onSubmit = () => {
		if (isSubmitted) {
			return false;
		}

		updateConfig({
			variables: {
				key: String(c.id),
				value: String(value),
			},
		}).then(() => {
			setSubmitted(true);
			toast({
				success: t("messages.configuratie.updateSuccess"),
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
		deleteConfig().then(result => {
			if (result.data?.deleteConfiguratie?.ok) {
				setDeleteConfirm(false);
				toast.closeAll();
				toast({
					success: t("messages.configuratie.deleteSuccess"),
				});
			}
		});
	};

	const onFocus = () => {
		setSubmitted(false);
		setDeleteConfirm(false);
	};

	return (
		<Tr>
			<Td>{c.id}</Td>
			<Td>
				<Editable defaultValue={c.waarde} flex={1} submitOnBlur={true} onSubmit={onSubmit} onFocus={onFocus}>
					<EditablePreview />
					<EditableInput onChange={onChange} name={c.id} id={c.id} />
				</Editable>
			</Td>
			<Td>
				<HStack>
					{deleteConfirm ? (<>
						<IconButton size={"sm"} flex={0} variant={"solid"} colorScheme={"red"} icon={<CheckIcon />} aria-label={t("global.actions.delete")}
							onClick={() => onClickDelete()} />
						<IconButton size={"sm"} flex={0} variant={"solid"} colorScheme={"gray"} icon={<CloseIcon />} aria-label={t("global.actions.cancel")}
							onClick={() => setDeleteConfirm(false)} />
					</>) : (
						<IconButton size={"sm"} flex={0} variant={"ghost"} colorScheme={"gray"} icon={<DeleteIcon />}
							aria-label={t("global.actions.delete")} onClick={() => setDeleteConfirm(true)} />
					)}
				</HStack>
			</Td>
		</Tr>
	);
};

export default ParameterItem;