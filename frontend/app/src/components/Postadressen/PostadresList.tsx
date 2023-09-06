import {Table, TableProps, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Afdeling, GetAfdelingDocument, GetOrganisatieDocument, GetOrganisatiesDocument, Postadres, useDeleteAfdelingPostadresMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import PostadresListItem from "./PostadresListItem";

type PostadressenListProps = { postadressen: Postadres[], afdeling: Afdeling };
const PostadresList: React.FC<TableProps & PostadressenListProps> = ({postadressen, afdeling, ...props}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const [deleteAfdelingRekening] = useDeleteAfdelingPostadresMutation({
		refetchQueries: [
			{query: GetAfdelingDocument, variables: {id: afdeling.id}},
			{query: GetOrganisatiesDocument},
			{query: GetOrganisatieDocument, variables: {id: afdeling?.organisatie?.id}},
		],
	});

	const onDeleteAfdelingPostadres = (postadresId?: string, afdelingId?: number) => {
		if (postadresId && afdelingId) {
			deleteAfdelingRekening({variables: {id: postadresId, afdelingId}})
				.then(() => {
					toast({
						success: t("messages.postadressen.deleteSuccess"),
					});
				})
				.catch(err => {
					console.error(err);
					toast({
						error: err.message,
					});
				});
		}
	};

	if (postadressen.length === 0) {
		return null;
	}

	return (
		<Table size={"sm"} variant={"noLeftPadding"} {...props}>
			<Thead>
				<Tr>
					<Th>{t("forms.postadressen.fields.straatnaam")}</Th>
					<Th>{t("forms.postadressen.fields.huisnummer")}</Th>
					<Th>{t("forms.postadressen.fields.postcode")}</Th>
					<Th>{t("forms.postadressen.fields.plaatsnaam")}</Th>
					<Th />
				</Tr>
			</Thead>
			<Tbody>
				{postadressen.map(p => (
					<PostadresListItem key={p.id} postadres={p} {...afdeling && {
						onDelete: () => onDeleteAfdelingPostadres(p.id!, afdeling.id),
					}} afdeling={afdeling} />
				))}
			</Tbody>
		</Table>
	);
};

export default PostadresList;