import React from "react";
import {IRekening, IRekeningInput} from "../../models";
import {useInput, useIsMobile, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Regex, TABLET_BREAKPOINT} from "../../utils/things";
import {friendlyFormatIBAN} from "ibantools";
import {Button, FormLabel, Input, SimpleGrid, Stack, useToast} from "@chakra-ui/core";

const RekeningForm: React.FC<{
	rekening?: Partial<IRekening>,
	onSave: (rekening: IRekeningInput, resetForm: VoidFunction) => void,
	onCancel: VoidFunction,
}> = ({rekening, onSave, onCancel}) => {
	const isMobile = useIsMobile(TABLET_BREAKPOINT);
	const {t} = useTranslation();
	const toast = useToast();

	const rekeninghouder = useInput({
		defaultValue: rekening?.rekeninghouder,
		validate: [Validators.required],
	});
	const iban = useInput({
		defaultValue: rekening?.iban,
		validate: [Validators.required, (v) => new RegExp(Regex.IbanNL).test(v)],
		placeholder: friendlyFormatIBAN("NL00BANK0123456789"),
	});

	const onSubmit = () => {
		const fieldsValid = [rekeninghouder, iban].every(f => f.isValid);

		if (!fieldsValid) {
			toast({
				status: "error",
				title: t("messages.rekeningen.invalidFormMessage"),
				position: "top",
			});
			return;
		}

		onSave({
			...(rekening || {}),
			rekeninghouder: rekeninghouder.value,
			iban: iban.value
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
				<Button type={"submit"} variantColor={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
			</Stack>
		</SimpleGrid>
	);
};

export default RekeningForm;