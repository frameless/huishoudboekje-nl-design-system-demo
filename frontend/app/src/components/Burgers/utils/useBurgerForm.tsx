import {useState} from "react";
import {CreateBurgerMutationVariables} from "../../../generated/graphql";
import d from "../../../utils/dayjs";
import zod from "../../../utils/zod";
import BurgerValidator from "../../../validators/BurgerValidator";

type BurgerFormData = CreateBurgerMutationVariables["input"];

const useBurgerForm = (burgerData?: BurgerFormData) => {
	const initialData: BurgerFormData = {
		bsn: undefined,
		voorletters: "",
		voornamen: "",
		achternaam: "",
		geboortedatum: "",
		email: "",
		straatnaam: "",
		huisnummer: "",
		postcode: "",
		plaatsnaam: "",
		telefoonnummer: "",
	};

	const createInitialState = (burgerData): zod.TypeOf<typeof BurgerValidator> => {
		return {
			...initialData,
			...burgerData,
			bsn: burgerData.bsn && String(burgerData.bsn),
			geboortedatum: burgerData.geboortedatum && d(burgerData.geboortedatum, "YYYY-MM-DD").format("L"),
		};
	};

	const [data, setData] = useState<zod.TypeOf<typeof BurgerValidator>>(createInitialState(burgerData));

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
		isValid: () => BurgerValidator.safeParse(data).success,
		isFieldValid: (fieldName: keyof typeof data | string) => BurgerValidator.shape[fieldName].safeParse(data?.[fieldName]).success,
		validator: BurgerValidator,
	};
};

export default useBurgerForm;