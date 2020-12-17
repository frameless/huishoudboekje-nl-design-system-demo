import React from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Afspraak} from "../../generated/graphql";
import StackOption from "./StackOption";

const AfspraakSelectOption = ({onSelectAfspraak, options, afspraak}) => {
	const {t} = useTranslation();

	const filterFn = (candidate, input) => {
		const d: Afspraak = candidate.data.afspraak;
		const searchData = [
			d.beschrijving,
			d.gebruiker?.voornamen,
			d.gebruiker?.voorletters,
			d.gebruiker?.achternaam,
			d.tegenRekening?.iban,
			d.organisatie?.weergaveNaam,
			d.organisatie?.kvkNummer,
			d.bedrag
		];

		console.log(searchData);

		return searchData.some(x => x && x.indexOf(input) > -1);
	}

	return (
		<Select components={{Option: StackOption, SingleValue: StackOption}} onChange={onSelectAfspraak} defaultValue={options.find(o => o.value === parseInt(afspraak.value))} options={options}
		        isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} filterOption={filterFn} />
	);
};

export default AfspraakSelectOption;