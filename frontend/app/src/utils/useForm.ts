import {Dispatch, SetStateAction, useState} from "react";
import {ZodSchema} from "zod";

export type FormData = Record<string, unknown>;

export type UseFormResult<T extends FormData> = [T | Partial<T>, {
	setForm: Dispatch<SetStateAction<T | Partial<T>>>,
	updateForm: (field: keyof T, value: unknown, callback?: (data) => T) => void,
	reset: VoidFunction,
	isSubmitted: boolean,
	toggleSubmitted: Dispatch<SetStateAction<boolean>>,
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
	const isFieldValid = (field: string) => {
		if (!validator) {
			return true;
		}

		const parsed = validator.safeParse(form);
		if (!isSubmitted) {
			return true;
		}

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
			isFieldValid,
			isValid,
		},
	];
};

export default useForm;
