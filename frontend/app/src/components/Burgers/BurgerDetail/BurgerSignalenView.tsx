import {Stack, StackProps} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import exampleSignalen from "../../../exampleSignalen.json"; // Todo: remove this once we can grab the signalen from the API
import {Burger, Signal} from "../../../generated/graphql";
import {FormLeft, FormRight} from "../../shared/Forms";
import SignalenList from "../../Signalen/SignalenList";

// Todo: remove this temporary type once "Signal" has been renamed to "Signaal" and context was changed.
export type Signaal = Omit<Signal, "context"> & {
	context: any,
	timeUpdated: string,
};

const BurgerSignalenView: React.FC<StackProps & {burger: Burger}> = ({burger, ...props}) => {
	const {t} = useTranslation();
	// const signalen: Signal[] = (burger.afspraken || []).map(afspraak => afspraak.alarm?.signaal as Signal) || [];

	return (
		<Stack spacing={2} mb={1} direction={["column", "row"]} {...props}>
			<FormLeft title={t("forms.burgers.sections.signalen.title")} helperText={t("forms.burgers.sections.signalen.detailText")} />
			<FormRight justifyContent={"center"}>
				<SignalenList signalen={exampleSignalen} />
			</FormRight>
		</Stack>
	);
};

export default BurgerSignalenView;