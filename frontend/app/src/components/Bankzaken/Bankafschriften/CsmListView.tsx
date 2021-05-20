import {BoxProps, FormLabel, Table, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {CustomerStatementMessage, useDeleteCustomerStatementMessageMutation} from "../../../generated/graphql";
import useToaster from "../../../utils/useToaster";
import CsmTableRow from "./CsmTableRow";

const CsmListView: React.FC<BoxProps & {csms: CustomerStatementMessage[], refresh: VoidFunction}> = ({csms, refresh}) => {
	const {t} = useTranslation();
	const toast = useToaster();

	const [deleteCustomerStatementMessage] = useDeleteCustomerStatementMessageMutation();

	const onDelete = (id: number) => {
		deleteCustomerStatementMessage({
			variables: {id},
		}).then(() => {
			toast({
				success: t("messages.customerStatementMessages.deleteSuccess"),
			});
			refresh();
		}).catch(err => {
			console.error(err);
			toast({
				error: err.message,
			});
		});
	};

	if (csms.length === 0) {
		return null;
	}

	return (
		<Table variant={"noLeftPadding"}>
			<Thead>
				<Tr>
					<Th>
						<FormLabel>{t("forms.banking.sections.customerStatementMessages.filename")}</FormLabel>
					</Th>
					<Th>
						<FormLabel>{t("forms.common.fields.time")}</FormLabel>
					</Th>
					<Th isNumeric>
						<FormLabel>{t("actions.actions")}</FormLabel>
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