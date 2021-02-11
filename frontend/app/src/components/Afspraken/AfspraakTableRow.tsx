import {CheckIcon, CloseIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {Badge, Box, HStack, IconButton, Stack, TableRowProps, Td, Text, Tr, useBreakpointValue, Wrap, WrapItem} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {Afspraak} from "../../generated/graphql";
import {currencyFormat2, intervalString} from "../../utils/things";
import XTooltip from "../Layouts/XTooltip";

const AfspraakTableRow: React.FC<TableRowProps & { afspraak: Afspraak, onDelete?: (id: number) => void }> = ({afspraak: a, onDelete, ...props}) => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

	const onClickDeleteButton = () => {
		if (onDelete && a.id) {
			if (!deleteConfirm) {
				setDeleteConfirm(true);
				return;
			}

			onDelete(a.id);
		}
	};
	const onClickDeleteCancel = () => {
		setDeleteConfirm(false);
	}

	const onClickEditButton = () => push(Routes.EditAfspraak(a.id));

	const bedrag = a.credit ? parseFloat(a.bedrag) : (parseFloat(a.bedrag) * -1);

	return (
		<Tr {...props}>
			<Td>{a.organisatie?.weergaveNaam || a.tegenRekening?.rekeninghouder || t("unknown")}</Td>
			{!isMobile && (<Td>
				<Text color={"gray.600"}>{a.beschrijving}</Text>
			</Td>)}
			<Td>
				<Stack spacing={1} flex={1} alignItems={"flex-end"}>
					<Box textAlign={"right"} color={bedrag < 0 ? "orange.500" : "currentcolor"}>{currencyFormat2().format(bedrag)}</Box>
					<Badge fontSize={"10px"}>{intervalString(a.interval, t)}</Badge>
				</Stack>
			</Td>
			<Td>
				<HStack>
					<IconButton variant={"ghost"} size={"sm"} icon={<EditIcon />} aria-label={t("actions.edit")} onClick={onClickEditButton} />
					{onDelete && (<>
						{deleteConfirm && <IconButton variant={"solid"} size={"xs"} icon={<CloseIcon />} colorScheme={"gray"}
													  mr={2} aria-label={t("actions.cancel")} onClick={onClickDeleteCancel} />}
						<IconButton variant={deleteConfirm ? "solid" : "ghost"} size={"xs"} icon={deleteConfirm ? <CheckIcon /> : <DeleteIcon />}
						            colorScheme={deleteConfirm ? "red" : "gray"} aria-label={t("actions.delete")} data-cy={deleteConfirm ? "deleteConfirmButton2" : "deleteConfirmButton1"}
						            onClick={onClickDeleteButton} />
					</>)}
				</HStack>
			</Td>
		</Tr>
	);
};

export default AfspraakTableRow;