import zod from "../utils/zod";

const AfspraakValidator = zod.object({
	rubriekId: zod.number().nonnegative(),
	omschrijving: zod.string().nonempty(),
	afdelingId: zod.number().nonnegative().optional(),
	postadresId: zod.number().nonnegative().optional(),
	tegenRekeningId: zod.number().nonnegative(),
	bedrag: zod.number().min(.01),
	credit: zod.boolean(),
});

export default AfspraakValidator;