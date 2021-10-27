import {useTranslation} from "react-i18next";
import {MultiLineOption, MultiLineValueContainer, ReverseMultiLineOption, ReverseMultiLineValueContainer} from "../components/Layouts/ReactSelect/CustomComponents";
import {Afdeling, Organisatie, Postadres, Rekening, Rubriek} from "../generated/graphql";
import {formatIBAN} from "./things";

export type SelectOption = {
	key: number | string,
	value: any,
	label: string | string[],
	context?: any
}

const createSelectOptionsFromRubrieken = (rubrieken: Rubriek[] = []): SelectOption[] => {
	return rubrieken.sort((a: Rubriek, b: Rubriek) => {
		return (a.naam && b.naam) && a.naam < b.naam ? -1 : 1;
	}).map((r: Rubriek): SelectOption => ({
		key: r.id!,
		value: r.id,
		label: r.naam!,
	}));
};

const createSelectOptionsFromRekeningen = (rekeningen: Rekening[] = []): SelectOption[] => {
	return rekeningen.map(r => ({
		key: r.id!,
		value: r.id,
		label: [formatIBAN(r.iban), r.rekeninghouder || ""],
		context: {
			iban: formatIBAN(r.iban),
			rekeninghouder: r.rekeninghouder,
		},
	}));
};

const createSelectOptionsFromOrganisaties = (organisaties: Organisatie[] = []): SelectOption[] => {
	return organisaties.map(o => ({
		key: o.id!,
		value: o.id,
		label: o.naam || "",
	}));
};

const createSelectOptionsFromAfdelingen = (afdelingen: Afdeling[] = []): SelectOption[] => {
	return afdelingen.map(a => ({
		key: a.id!,
		value: a.id!,
		label: a.naam || "",
	}));
};

const createSelectOptionsFromPostadressen = (postadressen: Postadres[] = []): SelectOption[] => {
	return postadressen.map(a => ({
		key: a.id!,
		value: a.id!,
		label: `${a.straatnaam} ${a.huisnummer}, ${a.postcode} ${a.plaatsnaam}`,
	}));
};

const useSelectProps = () => {
	const {t} = useTranslation();

	const defaultProps = {
		isClearable: true,
		noOptionsMessage: () => t("forms.generic.fields.noOptionsMessage"),
		placeholder: t("select.placeholder"),
		maxMenuHeight: 350,
	};

	const components = {
		MultiLine: {
			Option: MultiLineOption,
			ValueContainer: MultiLineValueContainer,
		},
		ReverseMultiLine: {
			Option: ReverseMultiLineOption,
			ValueContainer: ReverseMultiLineValueContainer,
		},
	};

	return {
		defaultProps,
		components,
		createSelectOptionsFromRekeningen,
		createSelectOptionsFromRubrieken,
		createSelectOptionsFromOrganisaties,
		createSelectOptionsFromAfdelingen,
		createSelectOptionsFromPostadressen
	};
};

export default useSelectProps;