import {IconButton, Text} from "@chakra-ui/core";
import moment from "moment";
import React, {useState} from "react";
import {useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {ICustomerStatementMessage} from "../../../models";

const CsmTableRow: React.FC<{ csm: ICustomerStatementMessage, onDelete: (id: number) => void }> = ({csm, onDelete}) => {
	const {t} = useTranslation();
	const isMobile = useIsMobile();
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
			<td>
				<Text>{moment(csm.uploadDate).fromNow(isMobile)}</Text>
			</td>
			<td>
				<Text>{csm.accountIdentification}</Text>
			</td>
			<td style={{width: "100px", textAlign: "right"}}>
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

export default CsmTableRow;