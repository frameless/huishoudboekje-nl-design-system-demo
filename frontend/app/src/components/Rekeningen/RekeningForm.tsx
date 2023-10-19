import {Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Rekening} from "../../generated/graphql";
import {sanitizeIBAN} from "../../utils/things";
import useForm from "../../utils/useForm";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import useRekeningValidator from "../../validators/useRekeningValidator";
import Asterisk from "../shared/Asterisk";

type RekeningFormProps = {
	rekening?: Rekening,
	onSubmit: (rekening: Rekening) => void,
	onCancel: VoidFunction,
	isIbanValid?: boolean,
}

const RekeningForm: React.FC<RekeningFormProps> = ({rekening, onSubmit, onCancel, isIbanValid = true}) => {
	const validator = useRekeningValidator();
	const {t} = useTranslation();
	const toast = useToaster();
	const {iban, rekeninghouder} = rekening || {};
	const [form, {updateForm, toggleSubmitted, isFieldValid}] = useForm<zod.infer<typeof validator>>({
		validator,
		initialValue: {
			iban, rekeninghouder,
		},
	});

	const onSubmitForm = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		try {
			const data = validator.parse(form);

			const ibanNoSpaces = data.iban?.trim().replaceAll(" ", "");
			updateForm("iban", ibanNoSpaces);

			onSubmit({
				...rekening || {},
				rekeninghouder: data.rekeninghouder,
				iban: data.iban ? sanitizeIBAN(data.iban) : undefined,
			});
			return;
		}
		catch (err) {
			toast.closeAll();
			toast({
				error: t("messages.formInputError"),
			});
		}
	};

	return (
		<form onSubmit={onSubmitForm}>
			<Stack>
				<FormControl isInvalid={!isFieldValid("rekeninghouder")} id={"rekeninghouder"} isRequired={true}>
					<FormLabel>{t("forms.rekeningen.fields.accountHolder")}</FormLabel>
					<Input
						autoComplete="no"
						aria-autocomplete="none"
						onChange={e => updateForm("rekeninghouder", e.target.value)}
						value={form.rekeninghouder || ""}
						autoFocus={!rekening?.rekeninghouder}
					/>
					<FormErrorMessage>{t("errors.rekeninghouder.generalError")}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={!isFieldValid("iban") || !isIbanValid} id={"iban"} isRequired={!rekening?.iban} isDisabled={!!rekening?.iban}>
					<FormLabel>{t("forms.rekeningen.fields.iban")}</FormLabel>
					<Input
						autoComplete="no"
						aria-autocomplete="none"
						onChange={e => updateForm("iban", e.target.value)}
						value={form.iban || ""}
						placeholder={"NL00BANK0123456789"}
						autoFocus={!!rekening?.rekeninghouder}
						onBlur={e => updateForm("iban", e.target.value.replaceAll(/[\s]/g, "").toUpperCase())}
					/>
					<FormErrorMessage>{t("errors.iban.generalError")}</FormErrorMessage>
				</FormControl>
				<Stack align={"flex-end"}>
					<HStack justify={"flex-end"}>
						<Button type={"reset"} onClick={() => onCancel()}>{t("global.actions.cancel")}</Button>
						<Button type={"submit"} colorScheme={"primary"} onClick={onSubmitForm}>{t("global.actions.save")}</Button>
					</HStack>
					<Asterisk />
				</Stack>
			</Stack>
		</form>
	);
};

export default RekeningForm;
