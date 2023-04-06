import {useTranslation} from "react-i18next";
import zod from "zod";
import dayjs from "../utils/dayjs";
import {Regex} from "../utils/things";

const useBurgerValidator = () => {
	const {t} = useTranslation();

	return zod.object({
		bsn: zod.string().regex(/^([0-9]{8,9})$/),
		voorletters: zod.string().regex(/^([A-Z]\.)+$/),
		voornamen: zod.string().min(1).refine(v => v.trim().length > 0).transform(v => v.trim()),
		achternaam: zod.string().min(1).refine(v => v.trim().length > 0).transform(v => v.trim()),
		geboortedatum: zod.union([
			zod.string().regex(Regex.Date).refine(strval => dayjs(strval, "L").isSameOrBefore(dayjs()), {message: t("messages.burgers.invalidGeboortedatum")}),
			zod.null(),
		]),
		email: zod.string().min(1).email().nullable().optional(),
		straatnaam: zod.string().min(1).refine(v => v.trim().length > 0).transform(v => v.trim()),
		huisnummer: zod.string().min(1).refine(v => v.trim().length > 0).transform(v => v.trim()),
		postcode: zod.string().regex(Regex.ZipcodeNL),
		plaatsnaam: zod.string().min(1).refine(v => v.trim().length > 0).transform(v => v.trim()),
		telefoonnummer: zod.union([
			zod.string().regex(Regex.MobilePhoneNL),
			zod.string().regex(Regex.PhoneNumberNL),
		]).nullable().optional(),
	});
};

export default useBurgerValidator;
