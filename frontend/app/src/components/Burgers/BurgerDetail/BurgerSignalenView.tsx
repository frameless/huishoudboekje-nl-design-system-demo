import React from "react";
import {Stack, StackProps} from "@chakra-ui/react";
import {Burger} from "../../../generated/graphql";
import {FormLeft, FormRight} from "../../shared/Forms";
import {useTranslation} from "react-i18next";
import SignalenList from "../../Signalen/SignalenList";

const BurgerSignalenView: React.FC<StackProps & { burger: Burger }> = ({burger, ...props}) => {
	const {t} = useTranslation();
	// const afspraken: Afspraak[] = burger.afspraken || [];
	// const signalen: Signal[] = afspraken.map(afspraak => afspraak.alarm?.signaal as Signal) || []
	const signalen = [
		{
			"id": "10039f40-efe9-45af-ac56-e1ba5b50e6c7",
			"alarm": {
				"id": "f5283f61-c770-453c-b609-89e3416ad5b0",
				"isActive": true,
				"gebruikerEmail": "developer@sloothuizen.nl",
				"afspraak": {
					"id": 9,
					"bedrag": "939.94",
					"credit": false,
					"omschrijving": "Leefgeld"
				}
			},
			"isActive": true,
			"type": "default",
			"actions": [],
			"context": {
				"bedrag": "100.80",
				"datum": "2022-07-07"
			},
			"timeCreated": "2022-02-14T09:54:24.005Z"
		}
	]
	return (
		<Stack spacing={2} mb={1} direction={["column", "row"]} {...props}>
			<FormLeft title={t("forms.burgers.sections.signalen.title")} helperText={t("forms.burgers.sections.signalen.detailText")} />
			<FormRight justifyContent={"center"}>
				<SignalenList signalen={signalen as any} />
			</FormRight>
		</Stack>
	);
};

export default BurgerSignalenView;