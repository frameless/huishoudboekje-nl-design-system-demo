import {z as zod} from "zod";

/**
 * This function checks if the error of type ZodError includes any errors having any of the given errorCodes.
 * @param error
 * @param errorCodes
 */
export const containsZodErrorCode = (error: zod.ZodError, errorCodes: zod.ZodIssueCode[]) => error.errors.map(e => e.code).some(e => [...errorCodes].includes(e as any));

// Validators
export const zoektermValidator = zod.string().nonempty().min(1);

export default zod;