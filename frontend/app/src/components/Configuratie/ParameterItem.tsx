import {EditIcon} from "@chakra-ui/icons";
import {FormControlProps, HStack, IconButton, Td, Tr, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Configuratie, GetConfiguratieDocument, useDeleteConfiguratieMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import DeleteConfirmButton from "../shared/DeleteConfirmButton";
import UpdateParameterModal from "./UpdateParameterModal";

const ParameterItem: React.FC<FormControlProps & {c: Configuratie}> = ({c, ...props}) => {
	const toast = useToaster();
	const {t} = useTranslation();
	const updateParameterModal = useDisclosure();
	const [deleteConfig] = useDeleteConfiguratieMutation({
		refetchQueries: [
			{query: GetConfiguratieDocument},
		],
	});

	const onDelete = () => {
		deleteConfig({
			variables: {
				key: String(c.id),
			},
		}).then(() => {
			toast.closeAll();
			toast({
				success: t("messages.configuratie.deleteSuccess"),
			});
		}).catch(err => {
			toast.closeAll();
			toast({
				error: err.message,
			});
		});
	};

	return (<>
		{updateParameterModal.isOpen && (
			<UpdateParameterModal onClose={() => updateParameterModal.onClose()} configuratie={c} />
		)}

		<Tr>
			<Td>{c.id}</Td>
			<Td>{c.waarde}</Td>
			<Td>
				<HStack>
					<IconButton size={"sm"} variant={"ghost"} colorScheme={"gray"} icon={<EditIcon />} aria-label={t("global.actions.edit")} onClick={() => updateParameterModal.onOpen()} />
					<DeleteConfirmButton onConfirm={() => onDelete()} />
				</HStack>
			</Td>
		</Tr>
	</>);
};

export default ParameterItem;