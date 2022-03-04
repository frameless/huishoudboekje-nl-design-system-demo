import {Button, FormControl, FormErrorMessage, FormLabel, Input, Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Rekening} from "../../generated/graphql";
import {Regex, sanitizeIBAN} from "../../utils/things";
import useForm from "../../utils/useForm";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import Asterisk from "../shared/Asterisk";

const validator = zod.object({
	rekeninghouder: zod.string().nonempty().max(100),
	iban: zod.string().regex(Regex.IbanNL),
});

const RekeningForm: React.FC<{
    rekening?: Rekening,
    onSubmit: Function,
    onCancel: VoidFunction,
    isIbanValid?: boolean,
}> = ({rekening, onSubmit, onCancel, isIbanValid = true}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const {iban, rekeninghouder} = rekening || {};
	const [form, {updateForm, toggleSubmitted, isValid, isFieldValid}] = useForm<zod.infer<typeof validator>>({
		validator,
		initialValue: {
			iban, rekeninghouder,
		},
	});

	const onSubmitForm = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		if (isValid()) {
			const ibanNoSpaces = form.iban?.trim().replaceAll(" ", "");
			updateForm("iban", ibanNoSpaces);

			onSubmit({
				...(rekening || {}),
				rekeninghouder: form.rekeninghouder,
				iban: form.iban ? sanitizeIBAN(form.iban) : undefined,
			});
			return;
		}

		toast.closeAll();
		toast({
			error: t("messages.formInputError"),
		});
	};

	return (
		<form onSubmit={onSubmitForm}>
			<Stack>
				<FormControl isInvalid={!isFieldValid("rekeninghouder")} id={"rekeninghouder"}>
					<FormLabel>{t("forms.rekeningen.fields.accountHolder")}</FormLabel>
					<Input onChange={e => updateForm("rekeninghouder", e.target.value)} value={form.rekeninghouder || ""} autoFocus={!(rekening?.rekeninghouder)} />
					<FormErrorMessage>{t("errors.rekeninghouder.generalError")}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={!isFieldValid("iban") || !isIbanValid} id={"iban"} isRequired={true}>
					<FormLabel>{t("forms.rekeningen.fields.iban")}</FormLabel>
					<Input onChange={e => updateForm("iban", e.target.value)} value={form.iban || ""} placeholder={"NL00BANK0123456789"} autoFocus={!!(rekening?.rekeninghouder)} />
					<FormErrorMessage>{t("errors.iban.generalError")}</FormErrorMessage>
				</FormControl>
				<Stack direction={"row"} justify={"flex-end"}>
					<Button type={"reset"} onClick={() => onCancel()}>{t("global.actions.cancel")}</Button>
					<Button type={"submit"} colorScheme={"primary"} onClick={onSubmitForm}>{t("global.actions.save")}</Button>
				</Stack>
				<Stack direction={"row"} justify={"flex-end"}>
					<Asterisk />
				</Stack>
			</Stack>
		</form>
	);
};

export default RekeningForm;