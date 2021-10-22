import {useState} from "react";
import {CreateOrganisatieMutationVariables} from "../../../generated/graphql";
import zod from "../../../utils/zod";
import OrganisatieValidator from "../../../validators/OrganisatieValidator";

type OrganisatieFormData = CreateOrganisatieMutationVariables;

const useOrganisatieForm = (organisatieData?: Partial<OrganisatieFormData>) => {
	const initialData: OrganisatieFormData = {
		naam: "",
		kvknummer: "",
		vestigingsnummer: "",
	};

	const createInitialState = (organisatieData): zod.TypeOf<typeof OrganisatieValidator> => ({
		...initialData,
		...organisatieData,
	});

	const [data, setData] = useState<zod.TypeOf<typeof OrganisatieValidator>>(createInitialState(organisatieData));

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
		isValid: () => OrganisatieValidator.safeParse(data).success,
		isFieldValid: (fieldName: keyof typeof data) => OrganisatieValidator.shape[fieldName].safeParse(data?.[fieldName]).success,
		validator: OrganisatieValidator,
	};
};

export default useOrganisatieForm;