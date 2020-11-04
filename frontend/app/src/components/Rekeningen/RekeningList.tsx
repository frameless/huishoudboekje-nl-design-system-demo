import React from "react";
import {Box, BoxProps,} from "@chakra-ui/core";
import {IGebruiker, IRekening} from "../../models";
import RekeningListItem from "./RekeningListItem";

const RekeningList: React.FC<BoxProps & { rekeningen: IRekening[], gebruiker?: IGebruiker }> = ({rekeningen, gebruiker, ...props}) => {
	// const {t} = useTranslation();
	// const toast = useToast();
	// const [deleteGebruikerRekening] = useMutation(DeleteGebruikerRekeningMutation);

	const onDeleteRekening = async (id: number, gebruikerId: number) => {
		// Todo: deleteGebruikerRekeningMutation
		// deleteGebruikerRekening({
		// 	variables: {id, gebruiker_id: gebruikerId}
		// }).then(result => {
		// 	console.log(result);
		// 	toast({
		// 		status: "success",
		// 		title: t("messages.rekeningen.deleteSuccess"),
		// 		position: "top",
		// 	});
		// }).catch(err => {
		// 	console.log(err);
		// 	toast({
		// 		position: "top",
		// 		status: "error",
		// 		variant: "solid",
		// 		title: t("messages.genericError.title"),
		// 		description: t("messages.genericError.description"),
		// 	})
		// });
	}

	return (
		<Box>
			{rekeningen.map((r, i) => (
				<RekeningListItem key={i} mr={2} mb={2} rekening={r} {...gebruiker && {
					onDelete: () => onDeleteRekening(r.id, gebruiker.id)
				}} />
			))}
		</Box>
	);
};

export default RekeningList;