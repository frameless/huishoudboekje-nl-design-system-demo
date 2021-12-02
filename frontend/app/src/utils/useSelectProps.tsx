import {useTranslation} from "react-i18next";
import {MultiLineOption, MultiLineValueContainer, ReverseMultiLineOption, ReverseMultiLineValueContainer} from "../components/Layouts/ReactSelect/CustomComponents";
import {Afdeling, Grootboekrekening, Organisatie, Postadres, Rekening, Rubriek} from "../generated/graphql";
import {formatIBAN} from "./things";

export type SelectOption = {
	key: number | string,
	value: any,
	label: string | string[],
	context?: any
}

const sortByField = (fieldName: string) => {
	return (a, b) => (a[fieldName] && b[fieldName]) && a[fieldName] < b[fieldName] ? -1 : 1;
};

const createSelectOptionsFromRubrieken = (rubrieken: Rubriek[] = []): SelectOption[] => {
	return rubrieken.map((r: Rubriek): SelectOption => ({
		key: r.id!,
		value: r.id,
		label: r.naam!,
	})).sort(sortByField("label"));
};

const createSelectOptionsFromRekeningen = (rekeningen: Rekening[] = []): SelectOption[] => {
	return rekeningen.map(r => ({
		key: r.id!,
		value: r.id,
		label: [formatIBAN(r.iban), r.rekeninghouder || ""],
	})).sort(sortByField("label"));
};

const createSelectOptionsFromOrganisaties = (organisaties: Organisatie[] = []): SelectOption[] => {
	return organisaties.map(o => ({
		key: o.id!,
		value: o.id,
		label: o.naam || "",
	})).sort(sortByField("label"));
};

const createSelectOptionsFromAfdelingen = (afdelingen: Afdeling[] = []): SelectOption[] => {
	return afdelingen.map(a => ({
		key: a.id!,
		value: a.id!,
		label: a.naam || "",
	})).sort(sortByField("label"));
};

const createSelectOptionsFromPostadressen = (postadressen: Postadres[] = []): SelectOption[] => {
	return postadressen.map(a => ({
		key: a.id!,
		value: a.id!,
		label: `${a.straatnaam} ${a.huisnummer}, ${a.postcode} ${a.plaatsnaam}`,
	})).sort(sortByField("label"));
};

const createSelectOptionsFromGrootboekrekeningen = (grootboekrekeningen: Grootboekrekening[] = []): SelectOption[] => {
	return grootboekrekeningen.map(g => ({
		key: g.id!,
		value: g.id!,
		label: [g.naam!, g.id!],
	})).sort(sortByField("label"));
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
		createSelectOptionsFromPostadressen,
		createSelectOptionsFromGrootboekrekeningen,
	};
};

export default useSelectProps;