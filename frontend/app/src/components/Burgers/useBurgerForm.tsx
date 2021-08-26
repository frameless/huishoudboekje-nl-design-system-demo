import {useState} from "react";
import {CreateBurgerMutationVariables} from "../../generated/graphql";
import d from "../../utils/dayjs";
import {Regex} from "../../utils/things";
import zod from "../../utils/zod";

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

	const validator = zod.object({
		bsn: zod.string().regex(/^([0-9]{8,9})$/),
		voorletters: zod.string().regex(/^([A-Z]\.)+$/),
		voornamen: zod.string().nonempty("Oops"),
		achternaam: zod.string().nonempty(),
		geboortedatum: zod.string().regex(Regex.Date),
		email: zod.string().nonempty().email(),
		straatnaam: zod.string().nonempty(),
		huisnummer: zod.string().nonempty(),
		postcode: zod.string().regex(Regex.ZipcodeNL),
		plaatsnaam: zod.string().nonempty(),
		telefoonnummer: zod.union([
			zod.string().regex(Regex.MobilePhoneNL),
			zod.string().regex(Regex.PhoneNumberNL),
		]),
	});

	const createInitialState = (burgerData): zod.TypeOf<typeof validator> => {
		return {
			...initialData,
			...burgerData,
			bsn: burgerData.bsn && String(burgerData.bsn),
			geboortedatum: burgerData.geboortedatum && d(burgerData.geboortedatum, "YYYY-MM-DD").format("L"),
		};
	};

	const [data, setData] = useState<zod.TypeOf<typeof validator>>(createInitialState(burgerData));

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
		isFieldValid: (fieldName: keyof typeof data | string) => validator.shape[fieldName].safeParse(data?.[fieldName]).success,
		validator,
	};
};

export default useBurgerForm;