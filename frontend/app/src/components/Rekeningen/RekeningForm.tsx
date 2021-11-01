import {Button, FormControl, FormErrorMessage, FormLabel, Input, SimpleGrid, Stack, useBreakpointValue} from "@chakra-ui/react";
import {friendlyFormatIBAN} from "ibantools";
import React from "react";
import {useTranslation} from "react-i18next";
import {Rekening, RekeningInput} from "../../generated/graphql";
import {sanitizeIBAN} from "../../utils/things";
import useForm from "../../utils/useForm";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import RekeningValidator from "../../validators/RekeningValidator";

const useErrorMap = (t): zod.ZodErrorMap => (error, ctx) => {
	if (error.path.includes("iban")) {
		return {message: t("errors.iban.generalError")};
	}
	else if (error.path.includes("rekeninghouder")) {
		return {message: t("errors.rekeninghouder.generalError")};
	}

	return {message: ctx.defaultError};
};

const RekeningForm: React.FC<{
	rekening?: Rekening,
	onSubmit: (rekening: RekeningInput, resetForm: VoidFunction) => void,
	onCancel: VoidFunction,
}> = ({rekening, onSubmit, onCancel}) => {
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {t} = useTranslation();
	const toast = useToaster();
	const errorMap = useErrorMap(t);
	const [formData, {updateForm, reset, isSubmitted, toggleSubmitted}] = useForm<keyof RekeningInput, string | undefined>({
		iban: rekening?.iban,
		rekeninghouder: rekening?.rekeninghouder,
	});

	const isValid = (fieldName: string) => RekeningValidator.shape[fieldName]?.safeParse(formData[fieldName]).success;

	const onSubmitForm = (e) => {
		e.preventDefault();

		if (isSubmitted) {
			return;
		}
		toggleSubmitted(true);

		try {
			const ibanNoSpaces = formData.iban?.trim().replaceAll(" ", "");
			updateForm("iban", ibanNoSpaces);

			const data = RekeningValidator.parse(formData, {errorMap});
			onSubmit({
				...(rekening || {}),
				rekeninghouder: data.rekeninghouder,
				iban: data.iban ? sanitizeIBAN(data.iban) : undefined,
			}, () => {
				reset();
				toggleSubmitted(false);
			});
		}
		catch (err) {
			toggleSubmitted(false);
			toast.closeAll();
			toast({
				error: t("messages.formInputError"),
			});
		}
	};

	return (
		<form onSubmit={onSubmitForm}>
			<SimpleGrid minChildWidth={isMobile ? "100%" : 250} gridGap={2}>
				<Stack spacing={1}>
					<FormControl isInvalid={!isValid("rekeninghouder")} id={"rekeninghouder"}>
						<FormLabel>{t("forms.rekeningen.fields.accountHolder")}</FormLabel>
						<Input onChange={e => updateForm("rekeninghouder", e.target.value)} value={formData.rekeninghouder || ""} autoFocus={!(rekening?.rekeninghouder)} />
						<FormErrorMessage>{t("errors.rekeninghouder.generalError")}</FormErrorMessage>
					</FormControl>
				</Stack>
				<Stack spacing={1}>
					<FormControl isInvalid={!isValid("iban")} id={"iban"}>
						<FormLabel>{t("forms.rekeningen.fields.iban")}</FormLabel>
						<Input onChange={e => updateForm("iban", e.target.value)} value={formData.iban || ""} placeholder={friendlyFormatIBAN("NL00BANK0123456789") || ""} autoFocus={!!(rekening?.rekeninghouder)} />
						<FormErrorMessage>{t("errors.iban.generalError")}</FormErrorMessage>
					</FormControl>
				</Stack>
				<Stack direction={"row"} alignItems={"flex-end"}>
					<Button type={"reset"} onClick={() => onCancel()}>{t("global.actions.cancel")}</Button>
					<Button type={"submit"} colorScheme={"primary"} onClick={onSubmitForm} isDisabled={isSubmitted}>{t("global.actions.save")}</Button>
				</Stack>
			</SimpleGrid>
		</form>
	);
};

export default RekeningForm;