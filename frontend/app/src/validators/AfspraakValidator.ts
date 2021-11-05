import zod from "../utils/zod";

const AfspraakValidator = (type: "burger" | "organisatie") => zod.object({
	rubriekId: zod.number().nonnegative(),
	omschrijving: zod.string().nonempty(),
	...(type === "organisatie" && {
		afdelingId: zod.number().nonnegative(),
	}),
	...(type === "organisatie" && {
		postadresId: zod.string().nonempty(),
	}),
	tegenRekeningId: zod.number().nonnegative(),
	bedrag: zod.number().min(.01),
	credit: zod.boolean(),
});

export default AfspraakValidator;