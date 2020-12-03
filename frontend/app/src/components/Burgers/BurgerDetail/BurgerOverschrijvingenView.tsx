import {Stack} from "@chakra-ui/react";
import React from "react";
import {useIsMobileOnce} from "react-grapple";
import {useTranslation} from "react-i18next";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";

const BurgerOverschrijvingenView = ({burger, ...props}) => {
	const isMobile = useIsMobileOnce();
	const {t} = useTranslation();

	return (
		<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"} {...props}>
			<FormLeft title={t("forms.burgers.sections.rekeningen.title")} helperText={t("forms.burgers.sections.rekeningen.detailText")} />
			<FormRight justifyContent={"center"}>
				<pre>{JSON.stringify(burger, null, 2)}</pre>
				Overschrijvingen
			</FormRight>
		</Stack>
	);
};

export default BurgerOverschrijvingenView;