import {Table, TableProps, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Burger, Organisatie, Rekening, useDeleteBurgerRekeningMutation, useDeleteOrganisatieRekeningMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import RekeningListItem from "./RekeningListItem";

type RekeningListProps = {rekeningen: Rekening[], burger?: Burger, organisatie?: Organisatie, onChange?: VoidFunction};
const RekeningList: React.FC<TableProps & RekeningListProps> = ({rekeningen, burger, organisatie, onChange, ...props}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const [deleteBurgerRekening] = useDeleteBurgerRekeningMutation();
	const [deleteOrganizationRekening] = useDeleteOrganisatieRekeningMutation();

	const handleMutation = (mutation: Promise<any>) => {
		mutation.then(() => {
			toast({
				success: t("messages.rekeningen.deleteSuccess"),
			});

			if (onChange) {
				onChange();
			}
		}).catch(err => {
			console.error(err);
			toast({
				error: err.message,
			});
		});
	};

	const onDeleteBurgerRekening = (id?: number, burgerId?: number) => {
		if (id && burgerId) {
			handleMutation(deleteBurgerRekening({variables: {id, burgerId}}));
		}
	};

	const onDeleteOrganisatieRekening = (id?: number, orgId?: number) => {
		if (id && orgId) {
			handleMutation(deleteOrganizationRekening({variables: {id, orgId}}));
		}
	};

	if (rekeningen.length === 0) {
		return null;
	}

	return (
		<Table size={"sm"} {...props}>
			<Thead>
				<Tr>
					<Th>{t("forms.rekeningen.fields.accountHolder")}</Th>
					<Th>{t("forms.rekeningen.fields.iban")}</Th>
					<Th />
				</Tr>
			</Thead>
			<Tbody>
				{rekeningen.map((r, i) => (
					<RekeningListItem key={i} rekening={r} {...burger && {
						onDelete: () => onDeleteBurgerRekening(r.id, burger.id),
					}} {...organisatie && {
						onDelete: () => onDeleteOrganisatieRekening(r.id, organisatie.id),
					}} />
				))}
			</Tbody>
		</Table>
	);
};

export default RekeningList;