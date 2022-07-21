import * as zod from "zod";
import prisma from "../../src/client";

const validator = zod.object({
	actions: zod.string().array().optional(),
	alarmId: zod.string().nonempty(),
	banktransactieIds: zod.number().array().optional(),
	context: zod.any().optional(),
	bedragDifference: zod.string().optional(),
	isActive: zod.boolean(),
	type: zod.string(),
});

const createSignal = async (data: zod.infer<typeof validator>) => {
	validator.parse(data);
	return await prisma.signal.create({
		data: {
			actions: data.actions,
			alarmId: data.alarmId,
			banktransactieIds: data.banktransactieIds,
			context: data.context,
			bedragDifference: data.bedragDifference,
			isActive: data.isActive,
			type: data.type,
		},
	});
};

export default createSignal;
