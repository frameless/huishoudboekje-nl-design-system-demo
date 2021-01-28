import {Table, TableProps, Tbody, Th, Thead, Tr, useToast,} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Gebruiker, Organisatie, Rekening, useDeleteGebruikerRekeningMutation, useDeleteOrganisatieRekeningMutation} from "../../generated/graphql";
import RekeningListItem from "./RekeningListItem";

type RekeningListProps = { rekeningen: Rekening[], gebruiker?: Gebruiker, organisatie?: Organisatie, onChange?: VoidFunction };
const RekeningList: React.FC<TableProps & RekeningListProps> = ({rekeningen, gebruiker, organisatie, onChange, ...props}) => {
	const {t} = useTranslation();
	const toast = useToast();
	const [deleteGebruikerRekening] = useDeleteGebruikerRekeningMutation();
	const [deleteOrganizationRekening] = useDeleteOrganisatieRekeningMutation();

	const handleMutation = (mutation: Promise<any>) => {
		mutation.then(() => {
			toast({
				status: "success",
				title: t("messages.rekeningen.deleteSuccess"),
				position: "top",
			});

			if (onChange) {
				onChange();
			}
		}).catch(err => {
			console.error(err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				title: t("messages.genericError.title"),
				description: t("messages.genericError.description"),
			})
		});
	}

	const onDeleteGebruikerRekening = (id?: number, gebruikerId?: number) => {
		if (!id || !gebruikerId) {
			// Todo: show/log error
			return;
		}

		handleMutation(deleteGebruikerRekening({variables: {id, gebruikerId}}));
	}

	const onDeleteOrganisatieRekening = (id?: number, orgId?: number) => {
		if (!id || !orgId) {
			// Todo: show/log error
			return;
		}

		handleMutation(deleteOrganizationRekening({variables: {id, orgId}}));
	}

	if (rekeningen.length === 0) {
		return null;
	}

	return (
		<Table {...props}>
			<Thead>
				<Tr>
					<Th>{t("forms.rekeningen.fields.accountHolder")}</Th>
					<Th>{t("forms.rekeningen.fields.iban")}</Th>
					<Th />
				</Tr>
			</Thead>
			<Tbody>
				{rekeningen.map((r, i) => (
					<RekeningListItem key={i} rekening={r} {...gebruiker && {
						onDelete: () => onDeleteGebruikerRekening(r.id, gebruiker.id)
					}} {...organisatie && {
						onDelete: () => onDeleteOrganisatieRekening(r.id, organisatie.id)
					}} />
				))}
			</Tbody>
		</Table>
	);
};

export default RekeningList;