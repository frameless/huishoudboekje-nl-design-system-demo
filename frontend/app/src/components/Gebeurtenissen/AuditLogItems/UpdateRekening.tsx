import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {GebruikersActiviteit} from "../../../generated/graphql";

const UpdateRekening: React.FC<{ g: GebruikersActiviteit}> = ({g}) => {
	const {t} = useTranslation();
	const rekening = g.entities?.find(e => e.entityType === "rekening")?.rekening;

	const data = {
		gebruiker: g.gebruikerId || t("unknownGebruiker"),
		iban: rekening?.iban || t("unknownRekening"),
		rekeningHouder: rekening?.rekeninghouder || t("unknown"),
	};

	return <Trans i18nKey={"auditLog.updateRekening"} values={data} components={{
		strong: <strong />
	}} />
}

export default UpdateRekening;