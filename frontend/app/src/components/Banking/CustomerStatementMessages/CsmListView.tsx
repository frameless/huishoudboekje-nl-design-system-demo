import React from "react";
import {dateFormat} from "../../../utils/things";
import {BoxProps, IconButton, Text} from "@chakra-ui/core";
import {ICustomerStatementMessage} from "../../../models";
import {useTranslation} from "react-i18next";
import { Label } from "../../Forms/FormLeftRight";

const CsmListView: React.FC<BoxProps & { csms: ICustomerStatementMessage[] }> = ({csms}) => {
	const {t} = useTranslation();

	return (
		<table width={"100%"}>
			<thead>
				<tr>
					<td>
						<Label>{t("forms.common.fields.date")}</Label>
					</td>
					<td>
						<Label>{t("forms.banking.bankAccount")}</Label>
					</td>
					<td>
						<Label>{t("forms.banking.nTransactions")}</Label>
					</td>
					<td>
						<Label>{t("actions.actions")}</Label>
					</td>
				</tr>
			</thead>
			<tbody>
				{csms.map(csm => (
					<tr>
						<td>{dateFormat.format(new Date(csm.uploadDate))}</td>
						<td>{csm.accountIdentification}</td>
						<td style={{textAlign: "right", paddingRight: "10px"}}>
							<Text mr={4}>{csm.bankTransactions.length}</Text>
						</td>
						<td>
							<IconButton size={"sm"} variant={"ghost"} aria-label={t("actions.delete")} icon={"delete"} />
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default CsmListView;