import {Dispatch, SetStateAction, useState} from "react";

export type UseFormMethods<K extends keyof any = string, T = any> = {
	setForm: Dispatch<SetStateAction<Record<K, T>>>,
	updateForm: (field: K, value: T, callback?: (data) => Record<K, T>) => void,
	reset: VoidFunction,
	isSubmitted: boolean,
	toggleSubmitted: Dispatch<SetStateAction<boolean>>
}

const useForm = <K extends keyof any = string, T = any>(initialValue: Record<K, T>): [Record<K, T>, UseFormMethods<K, T>] => {
	const [form, setForm] = useState<Record<K, T>>(initialValue);
	const [isSubmitted, toggleSubmitted] = useState<boolean>(false);

	const updateForm = (field: K, value: T, callback?: (data) => Record<K, T>) => {
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

	const reset = () => setForm({} as Record<K, T>);

	return [form, {
		setForm,
		updateForm,
		reset,
		isSubmitted,
		toggleSubmitted,
	}];
};

export default useForm;