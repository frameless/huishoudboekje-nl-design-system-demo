import dayjs from "../utils/dayjs";
import {Regex} from "../utils/things";
import zod from "../utils/zod";

// t("messages.burgers.invalidGeboortedatum")
const BurgerValidator = zod.object({
	bsn: zod.string().regex(/^([0-9]{8,9})$/),
	voorletters: zod.string().regex(/^([A-Z]\.)+$/),
	voornamen: zod.string().nonempty(),
	achternaam: zod.string().nonempty(),
	geboortedatum: zod.string().regex(Regex.Date).refine(strval => dayjs(strval, "L").isSameOrBefore(dayjs()), {message: "messages.burgers.invalidGeboortedatum"}),
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

export default BurgerValidator;