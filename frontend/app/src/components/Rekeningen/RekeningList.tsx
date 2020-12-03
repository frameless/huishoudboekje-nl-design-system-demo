import {Box, BoxProps, useToast,} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Gebruiker, Organisatie, Rekening, useDeleteGebruikerRekeningMutation, useDeleteOrganisatieRekeningMutation} from "../../generated/graphql";
import RekeningListItem from "./RekeningListItem";

type RekeningListProps = { rekeningen: Rekening[], gebruiker?: Gebruiker, organisatie?: Organisatie, onChange?: VoidFunction };
const RekeningList: React.FC<BoxProps & RekeningListProps> = ({rekeningen, gebruiker, organisatie, onChange, ...props}) => {
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
		<Box {...props}>
			{rekeningen.map((r, i) => (
				<RekeningListItem key={i} mr={2} mb={2} rekening={r} {...gebruiker && {
					onDelete: () => onDeleteGebruikerRekening(r.id, gebruiker.id)
				}} {...organisatie && {
					onDelete: () => onDeleteOrganisatieRekening(r.id, organisatie.id)
				}} />
			))}
		</Box>
	);
};

export default RekeningList;