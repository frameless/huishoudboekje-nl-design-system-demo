import React from "react";
import {Box, BoxProps, useToast,} from "@chakra-ui/core";
import {IGebruiker, IOrganisatie, IRekening} from "../../models";
import RekeningListItem from "./RekeningListItem";
import {useTranslation} from "react-i18next";
import {useMutation} from "@apollo/client";
import {DeleteGebruikerRekeningMutation, DeleteOrganizationRekeningMutation} from "../../services/graphql/mutations";

const RekeningList: React.FC<BoxProps & { rekeningen: IRekening[], gebruiker?: IGebruiker, organization?: IOrganisatie, onChange?: VoidFunction }> = ({rekeningen, gebruiker, organization, onChange, ...props}) => {
	const {t} = useTranslation();
	const toast = useToast();
	const [deleteGebruikerRekening] = useMutation(DeleteGebruikerRekeningMutation);
	const [deleteOrganizationRekening] = useMutation(DeleteOrganizationRekeningMutation);

	const onDeleteRekening = async (id: number, entity: "gebruiker" | "organization", entityId: number) => {
		const mutation = {
			"gebruiker": deleteGebruikerRekening,
			"organization": deleteOrganizationRekening,
		}[entity];
		const variables = {
			"gebruiker": {id, gebruikerId: entityId},
			"organization": {id, orgId: entityId},
		}[entity];

		mutation({variables}).then(() => {
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

	if (rekeningen.length === 0) {
		return null;
	}

	return (
		<Box {...props}>
			{rekeningen.map((r, i) => (
				<RekeningListItem key={i} mr={2} mb={2} rekening={r} {...gebruiker && {
					onDelete: () => onDeleteRekening(r.id, "gebruiker", gebruiker.id)
				}} {...organization && {
					onDelete: () => onDeleteRekening(r.id, "organization", organization.id)
				}} />
			))}
		</Box>
	);
};

export default RekeningList;