import dayjs from "../utils/dayjs";
import {Regex} from "../utils/things";
import zod from "../utils/zod";

// t("messages.burgers.invalidGeboortedatum")
const BurgerValidator = zod.object({
	bsn: zod.string().regex(/^([0-9]{8,9})$/),
	voorletters: zod.string().regex(/^([A-Z]\.)+$/),
	voornamen: zod.string().nonempty().refine(v => v.trim().length > 0).transform(v => v.trim()),
	achternaam: zod.string().nonempty().refine(v => v.trim().length > 0).transform(v => v.trim()),
	geboortedatum: zod.string().regex(Regex.Date).refine(strval => dayjs(strval, "L").isSameOrBefore(dayjs()), {message: "messages.burgers.invalidGeboortedatum"}),
	email: zod.string().nonempty().email(),
	straatnaam: zod.string().nonempty().refine(v => v.trim().length > 0).transform(v => v.trim()),
	huisnummer: zod.string().nonempty().refine(v => v.trim().length > 0).transform(v => v.trim()),
	postcode: zod.string().regex(Regex.ZipcodeNL),
	plaatsnaam: zod.string().nonempty().refine(v => v.trim().length > 0).transform(v => v.trim()),
	telefoonnummer: zod.union([
		zod.string().regex(Regex.MobilePhoneNL),
		zod.string().regex(Regex.PhoneNumberNL),
	]),
});

export default BurgerValidator;