import {CheckIcon, CloseIcon, DeleteIcon} from "@chakra-ui/icons";
import {IconButton, Td, Text, Tr, useBreakpointValue} from "@chakra-ui/react";
import moment from "moment";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {CustomerStatementMessage} from "../../../generated/graphql";

const CsmTableRow: React.FC<{ csm: CustomerStatementMessage, onDelete: (id: number) => void }> = ({csm, onDelete}) => {
	const {t} = useTranslation();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

	const onClickDeleteButton = () => {
		if (onDelete && csm.id) {
			if (!deleteConfirm) {
				setDeleteConfirm(true);
				return;
			}

			onDelete(csm.id);
			setDeleteConfirm(false);
		}
	};

	const onClickDeleteCancel = () => {
		setDeleteConfirm(false);
	}

	return (
		<Tr>
			<Td>
				<Text>{csm.filename}</Text>
			</Td>
			<Td>
				<Text>{moment(csm.uploadDate).fromNow(!!isMobile)}</Text>
			</Td>
			<Td style={{width: "100px", textAlign: "right"}}>
				{onDelete && (<>
					<IconButton variant={deleteConfirm ? "solid" : "ghost"} size={"xs"} icon={deleteConfirm ? <CheckIcon /> : <DeleteIcon />}
					            colorScheme={deleteConfirm ? "red" : "gray"}
					            aria-label={t("actions.delete")} onClick={onClickDeleteButton} />
					{deleteConfirm && (
						<IconButton variant={"solid"} size={"xs"} icon={<CloseIcon />} colorScheme={"gray"} ml={2} aria-label={t("actions.delete")} onClick={onClickDeleteCancel} />
					)}
				</>)}
			</Td>
		</Tr>
	)
}

export default CsmTableRow;