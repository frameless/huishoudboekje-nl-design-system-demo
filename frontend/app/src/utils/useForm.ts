import {Dispatch, SetStateAction, useState} from "react";
import {ZodSchema} from "zod";

export type FormData = Record<string, unknown>;

export type UseFormResult<T extends FormData> = [T | Partial<T>, {
	setForm: Dispatch<SetStateAction<T | Partial<T>>>,
	updateForm: (field: keyof T, value: unknown, callback?: (data) => T) => void,
	reset: VoidFunction,
	isSubmitted: boolean,
	toggleSubmitted: Dispatch<SetStateAction<boolean>>,
	isFieldDirty: (field: string) => boolean,
	isFieldValid: (field: string) => boolean,
	isValid: () => boolean,
}];

interface UseFormParams<T extends FormData> {
	initialValue?: T | Partial<T>;
	validator?: ZodSchema<T | Partial<T>>;
}

const useForm = <T extends FormData>({initialValue = {}, validator}: UseFormParams<T>): UseFormResult<T> => {
	const [form, setForm] = useState<T | Partial<T>>(initialValue);
	const [isSubmitted, toggleSubmitted] = useState<boolean>(false);
	const isFieldDirty = (field: string) => {
		//No check if it has an initial value, because the initial value can be undefined.
		//In the onchange the value changes from undefined to an empty string. The field is not dirty when the value is undefined.
		if(field in form){
			return form[field] !== initialValue[field] && form[field] !== ""
		}
		return false;
	};
	const isFieldValid = (field: string) => {
		if (!validator) {
			return true;
		}
		if (!isSubmitted && !isFieldDirty(field)) {
			return true;
		}

		const parsed = validator.safeParse(form);
		return parsed.success || !parsed.error.issues.find(issue => issue.path?.[0] === field);
	};
	const isValid = () => {
		if (!validator) {
			return true;
		}

		return validator.safeParse(form).success;
	};

	const updateForm = (field: keyof T, value: unknown, callback?: (data) => T) => {
		setForm(prevData => {
			let newData = {
				...prevData,
				[field]: value,
			};

			if (callback) {
				newData = {
					...newData,
					...callback(newData),
				};
			}
			return newData;
		});
	};

	const reset = () => {
		setForm(initialValue);
		toggleSubmitted(false);
	};

	return [
		form,
		{
			setForm,
			updateForm,
			reset,
			isSubmitted,
			toggleSubmitted,
			isFieldDirty,
			isFieldValid,
			isValid,
		},
	];
};

export default useForm;
