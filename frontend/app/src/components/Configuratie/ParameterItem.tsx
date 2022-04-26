import {Editable, EditableInput, EditablePreview, FormControlProps, Td, Tr} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Configuratie as IConfiguratie, GetConfiguratieDocument, useDeleteConfiguratieMutation, useUpdateConfiguratieMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import DeleteConfirmButton from "../shared/DeleteConfirmButton";

const ParameterItem: React.FC<FormControlProps & {c: IConfiguratie}> = ({c, ...props}) => {
	const toast = useToaster();
	const {t} = useTranslation();
	const [value, setValue] = useState(c.waarde);
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
		}).catch(err => {
			toast({
				error: err.message,
			});
		});
	};

	const onDelete = () => {
		if (!c.id) {
			return;
		}

		deleteConfig({
			variables: {
				key: c.id,
			},
		}).then(() => {
			toast.closeAll();
			toast({
				success: t("messages.configuratie.deleteSuccess"),
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
		<Tr>
			<Td>{c.id}</Td>
			<Td>
				<Editable defaultValue={c.waarde} flex={1} submitOnBlur={true} onSubmit={onSubmit} onFocus={onFocus}>
					<EditablePreview />
					<EditableInput onChange={onChange} name={c.id} id={c.id} />
				</Editable>
			</Td>
			<Td>
				<DeleteConfirmButton onConfirm={() => onDelete()} />
			</Td>
		</Tr>
	);
};

export default ParameterItem;