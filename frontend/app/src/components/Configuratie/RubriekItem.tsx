import {EditIcon} from "@chakra-ui/icons";
import {HStack, IconButton, Stack, Td, Text, Tooltip, Tr, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {GetRubriekenDocument, Rubriek, useDeleteRubriekMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import DeleteConfirmButton from "../shared/DeleteConfirmButton";
import UpdateRubriekModal from "./UpdateRubriekModal";

const RubriekItem: React.FC<{rubriek: Rubriek}> = ({rubriek}) => {
	const toast = useToaster();
	const {t} = useTranslation();
	const updateRubriekenModal = useDisclosure();
	const [deleteRubriek] = useDeleteRubriekMutation({
		refetchQueries: [
			{query: GetRubriekenDocument},
		],
	});

	const onDelete = () => {
		if (!rubriek.id) {
			return;
		}

		deleteRubriek({
			variables: {
				id: rubriek.id,
			},
		})
			.then(() => {
				toast.closeAll();
				
				const tableRow = document.getElementById("rubriek_line_" + rubriek.id);

				if (tableRow) {
					tableRow.style.display = "none";
				}

				toast({
					success: t("messages.rubrieken.deleteSuccess"),
				});
			})
			.catch(err => {
				toast.closeAll();
				toast({
					error: err.message,
				});
			});
	};

	return (<>
		{updateRubriekenModal.isOpen && <UpdateRubriekModal onClose={updateRubriekenModal.onClose} rubriek={rubriek} />}

		<Tr key={rubriek.id} id={"rubriek_line_" + rubriek.id}>
			<Td>
				<Tooltip label={rubriek.grootboekrekening?.naam}>
					<Stack spacing={0}>
						<Text>{rubriek.grootboekrekening?.id}</Text>
						<Text fontSize={"sm"}>{rubriek.grootboekrekening?.omschrijving}</Text>
					</Stack>
				</Tooltip>
			</Td>
			<Td>
				{rubriek.naam}
			</Td>
			<Td>
				<HStack>
					<IconButton size={"sm"} variant={"ghost"} colorScheme={"gray"} icon={<EditIcon />} aria-label={t("global.actions.edit")} onClick={() => updateRubriekenModal.onOpen()} />
					<DeleteConfirmButton onConfirm={() => onDelete()} />
				</HStack>
			</Td>
		</Tr>
	</>);
};

export default RubriekItem;