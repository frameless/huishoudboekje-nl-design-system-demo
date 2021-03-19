import {CheckIcon, CloseIcon, DeleteIcon, EditIcon, ViewIcon} from "@chakra-ui/icons";
import {Badge, Box, HStack, IconButton, Stack, TableRowProps, Td, Text, Tr, useBreakpointValue} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import Routes from "../../config/routes";
import {Afspraak} from "../../generated/graphql";
import {currencyFormat2, intervalString} from "../../utils/things";

const AfspraakTableRow: React.FC<TableRowProps & {afspraak: Afspraak, canEdit?: boolean, onDelete?: (id: number) => void}> = (props) => {
	const {afspraak: a, onDelete, canEdit = true, ...rest} = props;
	const {t} = useTranslation();
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
	};

	const bedrag = a.credit ? parseFloat(a.bedrag) : (parseFloat(a.bedrag) * -1);

	return (
		<Tr {...rest}>
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
					<NavLink to={Routes.ViewAfspraak(a.id)}>
						<IconButton variant={"ghost"} size={"sm"} icon={<ViewIcon />} aria-label={t("actions.view")} />
					</NavLink>
					{canEdit && ( /* Todo: move this button to AfspraakDetailView (19-03-2021) */
						<NavLink to={Routes.EditAfspraak(a.id)}>
							<IconButton variant={"ghost"} size={"sm"} icon={<EditIcon />} aria-label={t("actions.edit")} />
						</NavLink>
					)}
					{onDelete && (/* Todo: move this button to AfspraakDetailView (19-03-2021) */ <>
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