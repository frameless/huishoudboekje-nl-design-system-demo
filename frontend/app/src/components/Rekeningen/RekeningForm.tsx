import {Button, FormLabel, Input, SimpleGrid, Stack, useBreakpointValue} from "@chakra-ui/react";
import {friendlyFormatIBAN} from "ibantools";
import React from "react";
import {useInput, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Rekening, RekeningInput} from "../../generated/graphql";
import {Regex, sanitizeIBAN} from "../../utils/things";
import useToaster from "../../utils/useToaster";

const RekeningForm: React.FC<{
	rekening?: Rekening,
	onSave: (rekening: RekeningInput, resetForm: VoidFunction) => void,
	onCancel: VoidFunction,
}> = ({rekening, onSave, onCancel}) => {
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {t} = useTranslation();
	const toast = useToaster();

	const rekeninghouder = useInput({
		defaultValue: rekening?.rekeninghouder,
		validate: [Validators.required],
	});
	const iban = useInput({
		defaultValue: rekening?.iban,
		validate: [Validators.required, (v) => new RegExp(Regex.IbanNL).test(sanitizeIBAN(v))],
		placeholder: friendlyFormatIBAN("NL00BANK0123456789") || "",
	});

	const onSubmit = () => {
		const fieldsValid = [rekeninghouder, iban].every(f => f.isValid);
		if (!fieldsValid) {
			toast({
				error: t("messages.rekeningen.invalidFormMessage"),
			});
			return;
		}

		onSave({
			...(rekening || {}),
			rekeninghouder: rekeninghouder.value,
			iban: sanitizeIBAN(iban.value),
		}, () => {
			rekeninghouder.reset();
			iban.reset();
		});
	};

	const isInvalid = (input) => input.dirty && !input.isValid;

	return (
		<SimpleGrid minChildWidth={isMobile ? "100%" : 250} gridGap={2}>
			<Stack spacing={1}>
				<FormLabel htmlFor={"rekeninghouder"}>{t("forms.rekeningen.fields.accountHolder")}</FormLabel>
				<Input isInvalid={isInvalid(rekeninghouder)} {...rekeninghouder.bind} id="rekeninghouder" autoFocus={!(rekening?.rekeninghouder)} />
			</Stack>
			<Stack spacing={1}>
				<FormLabel htmlFor={"iban"}>{t("forms.rekeningen.fields.iban")}</FormLabel>
				<Input isInvalid={isInvalid(iban)} {...iban.bind} id="iban" autoFocus={!!(rekening?.rekeninghouder)} />
			</Stack>
			<Stack direction={"row"} alignItems={"flex-end"}>
				<Button type={"reset"} onClick={() => onCancel()}>{t("actions.cancel")}</Button>
				<Button type={"submit"} colorScheme={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
			</Stack>
		</SimpleGrid>
	);
};

export default RekeningForm;