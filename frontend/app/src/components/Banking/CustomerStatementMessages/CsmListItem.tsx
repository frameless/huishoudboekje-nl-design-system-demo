import {IconButton, Text} from "@chakra-ui/core";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {ICustomerStatementMessage} from "../../../models";
import {dateFormat} from "../../../utils/things";

const CsmListItem: React.FC<{ csm: ICustomerStatementMessage, onDelete: (id: number) => void }> = ({csm, onDelete}) => {
	const {t} = useTranslation();
	const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

	const onClickDeleteButton = () => {
		if (onDelete) {
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
		<tr>
			<td>{dateFormat.format(new Date(csm.uploadDate))}</td>
			<td>{csm.accountIdentification}</td>
			<td style={{textAlign: "right", paddingRight: "10px"}}>
				<Text mr={4}>{csm.bankTransactions.length}</Text>
			</td>
			<td style={{width: "100px"}}>
				{onDelete && (<>
					<IconButton variant={deleteConfirm ? "solid" : "ghost"} size={"xs"} icon={deleteConfirm ? "check" : "delete"} variantColor={deleteConfirm ? "red" : "gray"}
					            aria-label={t("actions.delete")} onClick={onClickDeleteButton} />
					{deleteConfirm && (
						<IconButton variant={"solid"} size={"xs"} icon={"close"} variantColor={"gray"} ml={2} aria-label={t("actions.delete")} onClick={onClickDeleteCancel} />
					)}
				</>)}
			</td>
		</tr>
	)
}

export default CsmListItem;