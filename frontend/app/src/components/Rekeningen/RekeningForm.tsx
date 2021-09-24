import {Button, FormControl, FormErrorMessage, FormLabel, Input, SimpleGrid, Stack, useBreakpointValue} from "@chakra-ui/react";
import {friendlyFormatIBAN} from "ibantools";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Rekening, RekeningInput} from "../../generated/graphql";
import {sanitizeIBAN} from "../../utils/things";
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

	const [rekeninghouder, setRekeninghouder] = useState<string>(rekening?.rekeninghouder || "");
	const [iban, setIban] = useState<string>(rekening?.iban || "");

	const isValid = (fieldName: string) => RekeningValidator.shape[fieldName]?.safeParse(rekeninghouder).success;

	const onSubmitForm = (e) => {
		e.preventDefault();

		try {
			const ibanNoSpaces = iban.trim().replaceAll(" ", "");
			setIban(ibanNoSpaces);

			const data = RekeningValidator.parse({rekeninghouder, iban: ibanNoSpaces}, {errorMap});
			onSubmit({
				...(rekening || {}),
				rekeninghouder: data.rekeninghouder,
				iban: data.iban ? sanitizeIBAN(data.iban) : undefined,
			}, () => {
				setRekeninghouder("");
				setIban("");
			});
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
			<SimpleGrid minChildWidth={isMobile ? "100%" : 250} gridGap={2}>
				<Stack spacing={1}>
					<FormControl isInvalid={!isValid("rekeninghouder")} id={"rekeninghouder"}>
						<FormLabel>{t("forms.rekeningen.fields.accountHolder")}</FormLabel>
						<Input onChange={e => setRekeninghouder(e.target.value)} value={rekeninghouder || ""} autoFocus={!(rekening?.rekeninghouder)} />
						<FormErrorMessage>{t("errors.rekeninghouder.generalError")}</FormErrorMessage>
					</FormControl>
				</Stack>
				<Stack spacing={1}>
					<FormControl isInvalid={!isValid("iban")} id={"iban"}>
						<FormLabel>{t("forms.rekeningen.fields.iban")}</FormLabel>
						<Input onChange={e => setIban(e.target.value)} value={iban || ""} placeholder={friendlyFormatIBAN("NL00BANK0123456789") || ""} autoFocus={!!(rekening?.rekeninghouder)} />
						<FormErrorMessage>{t("errors.iban.generalError")}</FormErrorMessage>
					</FormControl>
				</Stack>
				<Stack direction={"row"} alignItems={"flex-end"}>
					<Button type={"reset"} onClick={() => onCancel()}>{t("global.actions.cancel")}</Button>
					<Button type={"submit"} colorScheme={"primary"} onClick={onSubmitForm}>{t("global.actions.save")}</Button>
				</Stack>
			</SimpleGrid>
		</form>
	);
};

export default RekeningForm;