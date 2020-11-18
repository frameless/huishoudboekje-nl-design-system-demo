import {useMutation} from "@apollo/client";
import {BoxProps, useToast} from "@chakra-ui/core";
import React from "react";
import {useTranslation} from "react-i18next";
import {ICustomerStatementMessage} from "../../../models";
import {DeleteCustomerStatementMessageMutation} from "../../../services/graphql/mutations";
import {Label} from "../../Forms/FormLeftRight";
import CsmListItem from "./CsmListItem";

const CsmListView: React.FC<BoxProps & { csms: ICustomerStatementMessage[], refresh: VoidFunction }> = ({csms, refresh}) => {
	const {t} = useTranslation();
	const toast = useToast();

	const [deleteCustomerStatementMessage] = useMutation(DeleteCustomerStatementMessageMutation);

	const onDelete = (id: number) => {
		deleteCustomerStatementMessage({
			variables: {id}
		}).then(() => {
			toast({
				title: t("messages.customerStatementMessages.deleteSuccess"),
				position: "top",
				status: "success",
			});
			refresh();
		}).catch(err => {
			console.error(err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				description: t("messages.genericError.description"),
				title: t("messages.genericError.title")
			});
		});
	}

	if (csms.length === 0) {
		return null;
	}

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
					<td style={{ textAlign: "right" }}>
						<Label>{t("actions.actions")}</Label>
					</td>
				</tr>
			</thead>
			<tbody>
				{csms.map(csm => (
					<CsmListItem key={csm.id} csm={csm} onDelete={onDelete} />
				))}
			</tbody>
		</table>
	);
};

export default CsmListView;