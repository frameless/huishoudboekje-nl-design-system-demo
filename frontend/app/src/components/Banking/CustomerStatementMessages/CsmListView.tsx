import {BoxProps, Table, Tbody, Th, Thead, Tr, useToast} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {CustomerStatementMessage, useDeleteCustomerStatementMessageMutation} from "../../../generated/graphql";
import Label from "../../Layouts/Label";
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
		<Table>
			<Thead>
				<Tr>
					<Th>
						<Label>{t("forms.common.fields.time")}</Label>
					</Th>
					<Th>
						<Label>{t("forms.banking.bankAccount")}</Label>
					</Th>
					<Th isNumeric>
						<Label>{t("actions.actions")}</Label>
					</Th>
				</Tr>
			</Thead>
			<Tbody>
				{csms.map(csm => (
					<CsmTableRow key={csm.id} csm={csm} onDelete={onDelete} />
				))}
			</Tbody>
		</Table>
	);
};

export default CsmListView;