import {Table, TableProps, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Afdeling, Burger, GetBurgerDocument, GetBurgersDocument, GetBurgersSearchDocument, GetOrganisatieDocument, GetOrganisatiesDocument, Rekening, useDeleteAfdelingRekeningMutation, useDeleteBurgerRekeningMutation} from "../../generated/graphql";
import {useStore} from "../../store";
import useToaster from "../../utils/useToaster";
import RekeningListItem from "./RekeningListItem";

type RekeningListProps = { rekeningen: Rekening[], burger?: Burger, afdeling?: Afdeling };
const RekeningList: React.FC<TableProps & RekeningListProps> = ({rekeningen, burger, afdeling, ...props}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const {store} = useStore();
	const [deleteBurgerRekening] = useDeleteBurgerRekeningMutation({
		refetchQueries: [
			{query: GetBurgersDocument},
			{query: GetBurgerDocument, variables: {id: burger?.id}},
			{query: GetBurgersSearchDocument, variables: {search: store.burgerSearch}},
		],
	});
	const [deleteAfdelingRekening] = useDeleteAfdelingRekeningMutation({
		refetchQueries: [
			{query: GetOrganisatiesDocument},
			{query: GetOrganisatieDocument, variables: {id: afdeling?.id}},
		],
	});

	const onDeleteBurgerRekening = (id?: number, burgerId?: number) => {
		if (id && burgerId) {
			deleteBurgerRekening({
				variables: {
					id,
					burgerId,
				},
			}).then(() => {
				toast({
					success: t("messages.rekeningen.deleteSuccess"),
				});
			}).catch(err => {
				console.error(err);

				let error = err.message;
				if (err.message.includes("wordt gebruikt")) {
					error = t("messages.rekeningen.inUseDeleteError");
				}

				toast({
					error,
				});
			});
		}
	};

	const onDeleteAfdelingRekening = (rekeningId?: number, afdelingId?: number) => {
		if (rekeningId && afdelingId) {
			deleteAfdelingRekening({
				variables: {
					id: rekeningId,
					afdelingId,
				},
			}).then(() => {
				toast({
					success: t("messages.rekeningen.deleteSuccess"),
				});
			}).catch(err => {
				console.error(err);

				let error = err.message;
				if (err.message.includes("wordt gebruikt")) {
					error = t("messages.rekeningen.inUseDeleteError");
				}

				toast({
					error,
				});
			});
		}
	};

	if (rekeningen.length === 0) {
		return null;
	}

	return (
		<Table size={"sm"} variant={"noLeftPadding"} {...props}>
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
					}} {...afdeling && {
						onDelete: () => onDeleteAfdelingRekening(r.id, afdeling.id),
					}} />
				))}
			</Tbody>
		</Table>
	);
};

export default RekeningList;