import {CheckIcon, CloseIcon, DeleteIcon} from "@chakra-ui/icons";
import {Editable, EditableInput, EditablePreview, FormControl, FormControlProps, IconButton, Stack, useToast} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Configuratie as IConfiguratie, useDeleteConfiguratieMutation, useUpdateConfiguratieMutation} from "../../generated/graphql";
import Label from "../Layouts/Label";

const ConfiguratieItem: React.FC<FormControlProps & { c: IConfiguratie, refetch: VoidFunction }> = ({c, refetch, ...props}) => {
	const toast = useToast();
	const {t} = useTranslation();
	const [value, setValue] = useState(c.waarde);
	const [deleteConfirm, setDeleteConfirm] = useState(false);
	const [isSubmitted, setSubmitted] = useState(false);
	const onChange = (e) => {
		setValue(e.target.value);
	}

	const [updateConfig] = useUpdateConfiguratieMutation();
	const [deleteConfig] = useDeleteConfiguratieMutation({variables: {key: String(c.id)}});

	const onSubmit = () => {
		if (isSubmitted) {
			return false;
		}

		updateConfig({
			variables: {
				key: String(c.id),
				value: String(value),
			}
		}).then(() => {
			setSubmitted(true);
			toast({
				status: "success",
				title: t("messages.configuratie.updateSuccess"),
				position: "top",
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
	}

	const onDelete = () => {
		deleteConfig().then(() => {
			refetch();
			setDeleteConfirm(false);
			toast.closeAll();
			toast({
				status: "success",
				title: t("messages.configuratie.deleteSuccess"),
				position: "top",
			});
		});
	}

	const onFocus = () => {
		setSubmitted(false);
		setDeleteConfirm(false);
	};

	return (
		<FormControl key={c.id} {...props}>
			<Label>{c.id}</Label>
			<Stack direction={"row"} alignItems={"center"}>
				<Editable defaultValue={c.waarde} flex={1} submitOnBlur={true} onSubmit={onSubmit} onFocus={onFocus}>
					<EditablePreview />
					<EditableInput onChange={onChange} name={c.id} id={c.id} />
				</Editable>
				{deleteConfirm ? (<>
					<IconButton size={"sm"} flex={0} variant={"solid"} colorScheme={"red"} icon={<CheckIcon />} aria-label={t("actions.delete")}
					            onClick={() => onClickDelete()} />
					<IconButton size={"sm"} flex={0} variant={"solid"} colorScheme={"gray"} icon={<CloseIcon />} aria-label={t("actions.cancel")}
					            onClick={() => setDeleteConfirm(false)} />
				</>) : (
					<IconButton size={"sm"} flex={0} variant={"ghost"} colorScheme={"gray"} icon={<DeleteIcon />}
					            aria-label={t("actions.delete")} onClick={() => setDeleteConfirm(true)} />
				)}
			</Stack>
		</FormControl>
	)
}

export default ConfiguratieItem;