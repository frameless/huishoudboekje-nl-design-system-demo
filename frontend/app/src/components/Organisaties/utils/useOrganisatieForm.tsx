import {useState} from "react";
import {CreateOrganisatieMutationVariables} from "../../../generated/graphql";
import {Regex} from "../../../utils/things";
import zod from "../../../utils/zod";

type OrganisatieFormData = CreateOrganisatieMutationVariables;

const useOrganisatieForm = (organisatieData?: Partial<OrganisatieFormData>) => {
	const initialData: OrganisatieFormData = {
		naam: "",
		kvkNummer: "",
		straatnaam: "",
		huisnummer: "",
		postcode: "",
		plaatsnaam: "",
		vestigingsnummer: "",
	};

	const validator = zod.object({
		kvkNummer: zod.string().regex(Regex.KvkNummer),
		vestigingsnummer: zod.string().regex(Regex.Vestigingsnummer),
		naam: zod.string().nonempty(),
		straatnaam: zod.string().nonempty(),
		huisnummer: zod.string().nonempty(),
		postcode: zod.string().regex(Regex.ZipcodeNL),
		plaatsnaam: zod.string().nonempty(),
	});

	const createInitialState = (organisatieData): zod.TypeOf<typeof validator> => ({
		...initialData,
		...organisatieData,
	});

	const [data, setData] = useState<zod.TypeOf<typeof validator>>(createInitialState(organisatieData));

	const bind = (key: keyof typeof data) => (e) => updateForm(key, e.target.value);

	const updateForm = (key, value) => {
		setData(x => ({
			...x,
			[key]: value,
		}));
	};

	return {
		data,
		updateForm,
		bind,
		isValid: () => validator.safeParse(data).success,
		isFieldValid: (fieldName: keyof typeof data) => validator.shape[fieldName].safeParse(data?.[fieldName]).success,
		validator,
	};
};

export default useOrganisatieForm;