import {Table, TableProps, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {
	Afdeling,
	Burger,
	GetAfdelingDocument,
	GetBurgerDetailsDocument,
	GetBurgersDocument,
	GetBurgersSearchDocument,
	GetOrganisatieDocument,
	GetOrganisatiesDocument,
	Rekening,
	useDeleteAfdelingRekeningMutation,
	useDeleteBurgerRekeningMutation,
} from "../../generated/graphql";
import useStore from "../../store";
import useToaster from "../../utils/useToaster";
import RekeningListItem from "./RekeningListItem";

type RekeningListProps = {rekeningen: Rekening[], burger?: Burger, afdeling?: Afdeling};
const RekeningList: React.FC<TableProps & RekeningListProps> = ({rekeningen, burger, afdeling, ...props}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const burgerSearch = useStore(store => store.burgerSearch);
	const [deleteBurgerRekening] = useDeleteBurgerRekeningMutation({
		refetchQueries: [
			{query: GetBurgersDocument},
			{query: GetBurgerDetailsDocument, variables: {id: burger?.id}},
			{query: GetBurgersSearchDocument, variables: {search: burgerSearch}},
		],
	});
	const [deleteAfdelingRekening] = useDeleteAfdelingRekeningMutation({
		refetchQueries: [
			{query: GetOrganisatiesDocument},
			{query: GetOrganisatieDocument, variables: {id: afdeling?.id}},
			{query: GetAfdelingDocument, variables: {id: afdeling?.id}}
		],
	});

	const onDeleteBurgerRekening = (rekeningId?: number, burgerId?: number) => {
		if (rekeningId && burgerId) {
			deleteBurgerRekening({
				variables: {
					rekeningId,
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
				const tableRow = document.getElementById("bank_account_" + rekeningId);

				if (tableRow) {
					tableRow.style.display = "none";
				}

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
					<RekeningListItem key={i} rekening={r} afdeling={afdeling} burger={burger} {...burger && {
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
