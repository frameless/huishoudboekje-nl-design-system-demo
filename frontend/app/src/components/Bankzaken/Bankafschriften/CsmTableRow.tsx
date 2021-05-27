import {CheckIcon, CloseIcon, DeleteIcon} from "@chakra-ui/icons";
import {IconButton, Td, Text, Tr} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {CustomerStatementMessage} from "../../../generated/graphql";
import d from "../../../utils/dayjs";
import {truncateText} from "../../../utils/things";

type CsmTableRowProps = {
	csm: CustomerStatementMessage,
	onDelete?: (id: number) => void
};

const CsmTableRow: React.FC<CsmTableRowProps> = ({csm, onDelete}) => {
	const {t} = useTranslation();
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
	};

	return (
		<Tr>
			<Td>
				<Text>{truncateText(csm.filename || "", 60)}</Text>
			</Td>
			<Td>
				<Text fontSize={"sm"} color={"gray.500"}>{d(csm.uploadDate).format("L LT")}</Text>
			</Td>
			<Td style={{width: "100px", textAlign: "right"}}>
				<IconButton variant={deleteConfirm ? "solid" : "ghost"} size={"xs"} icon={deleteConfirm ? <CheckIcon /> : <DeleteIcon />}
					colorScheme={deleteConfirm ? "red" : "gray"} aria-label={t("actions.delete")} onClick={onClickDeleteButton} />
				{deleteConfirm && (
					<IconButton variant={"solid"} size={"xs"} icon={
						<CloseIcon />} colorScheme={"gray"} ml={2} aria-label={t("actions.delete")} onClick={onClickDeleteCancel} />
				)}
			</Td>
		</Tr>
	);
};

export default CsmTableRow;