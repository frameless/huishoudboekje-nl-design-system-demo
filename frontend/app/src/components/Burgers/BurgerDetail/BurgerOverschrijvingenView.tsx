import {Stack} from "@chakra-ui/react";
import React from "react";
import {useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {OverschrijvingStatus} from "../../../generated/graphql";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";
import OverschrijvingenListView from "../../Overschrijvingen/OverschrijvingenListView";

const sampleOverschrijvingen = [
	{
		"id": null,
		"export": null,
		"datum": "2020-01-01",
		"bedrag": "41.66",
		"status": OverschrijvingStatus.Verwachting
	},
	{
		"id": null,
		"export": null,
		"datum": "2020-02-01",
		"bedrag": "41.66",
		"status": OverschrijvingStatus.InBehandeling
	},
	{
		"id": null,
		"export": null,
		"datum": "2020-03-01",
		"bedrag": "41.66",
		"status": OverschrijvingStatus.InBehandeling
	},
	{
		"id": null,
		"export": null,
		"datum": "2020-04-01",
		"bedrag": "41.66",
		"status": OverschrijvingStatus.Verwachting
	},
	{
		"id": null,
		"export": null,
		"datum": "2020-05-01",
		"bedrag": "41.66",
		"status": OverschrijvingStatus.Gereed
	},
	{
		"id": null,
		"export": null,
		"datum": "2020-06-01",
		"bedrag": "41.66",
		"status": OverschrijvingStatus.Gereed
	},
	{
		"id": null,
		"export": null,
		"datum": "2020-07-01",
		"bedrag": "41.66",
		"status": OverschrijvingStatus.Verwachting
	},
	{
		"id": null,
		"export": null,
		"datum": "2020-08-01",
		"bedrag": "41.66",
		"status": OverschrijvingStatus.Verwachting
	},
	{
		"id": null,
		"export": null,
		"datum": "2020-09-01",
		"bedrag": "41.66",
		"status": OverschrijvingStatus.Verwachting
	},
	{
		"id": null,
		"export": null,
		"datum": "2020-10-01",
		"bedrag": "41.66",
		"status": OverschrijvingStatus.Verwachting
	},
	{
		"id": null,
		"export": null,
		"datum": "2020-11-01",
		"bedrag": "41.66",
		"status": OverschrijvingStatus.Verwachting
	},
	{
		"id": null,
		"export": null,
		"datum": "2020-12-01",
		"bedrag": "41.74",
		"status": OverschrijvingStatus.Verwachting
	}
];

const BurgerOverschrijvingenView = ({burger, ...props}) => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();

	const {overschrijvingen = sampleOverschrijvingen} = burger;

	return null;

	// return (
	// 	<Stack direction={isMobile ? "column" : "row"} spacing={2} mb={1} {...props}>
	// 		<FormLeft title={t("sections.burgers.overschrijvingen.title")} helperText={t("sections.burgers.overschrijvingen.detailText")} />
	// 		<FormRight justifyContent={"center"}>
	// 			{/* Todo: start and end date */}
	// 			<OverschrijvingenListView overschrijvingen={overschrijvingen} />
	// 		</FormRight>
	// 	</Stack>
	// );
};

export default BurgerOverschrijvingenView;