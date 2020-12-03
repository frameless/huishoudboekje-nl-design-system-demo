import {BoxProps, useToast} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {CustomerStatementMessage, useDeleteCustomerStatementMessageMutation} from "../../../generated/graphql";
import {Label} from "../../Forms/FormLeftRight";
import CsmTableRow from "./CsmTableRow";

const CsmListView: React.FC<BoxProps & { csms: CustomerStatementMessage[], refresh: VoidFunction }> = ({csms, refresh}) => {
	const {t} = useTranslation();
	const toast = useToast();

	const [deleteCustomerStatementMessage] = useDeleteCustomerStatementMessageMutation();

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
						<Label>{t("forms.common.fields.time")}</Label>
					</td>
					<td>
						<Label>{t("forms.banking.bankAccount")}</Label>
					</td>
					<td style={{textAlign: "right"}}>
						<Label>{t("actions.actions")}</Label>
					</td>
				</tr>
			</thead>
			<tbody>
				{csms.map(csm => (
					<CsmTableRow key={csm.id} csm={csm} onDelete={onDelete} />
				))}
			</tbody>
		</table>
	);
};

export default CsmListView;