import {Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {CreateAfdelingInput, Organisatie} from "../../generated/graphql";
import useForm from "../../utils/useForm";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import useAfdelingValidator from "../../validators/useAfdelingValidator";
import Asterisk from "../shared/Asterisk";

type AfdelingFormProps = {
	organisatie: Organisatie,
	onChange: (values) => void,
	onCancel: VoidFunction,
	values?: Partial<CreateAfdelingInput>,
};

const AfdelingForm: React.FC<AfdelingFormProps> = ({values, organisatie, onChange, onCancel}) => {
	const validator = useAfdelingValidator();
	const toast = useToaster();
	const {t} = useTranslation();
	const [form, {updateForm, toggleSubmitted, isFieldValid}] = useForm<zod.infer<typeof validator>>({
		validator,
		initialValue: values,
	});

	const onSubmit = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		try {
			const data = validator.parse(form);
			onChange({
				...data,
				organisatieId: organisatie.id,
			});
		}
		catch (err) {
			toast({error: t("global.formError"), title: t("messages.genericError.title")});
		}
	};

	return (
		<form onSubmit={onSubmit} noValidate={true}>
			<Stack spacing={5}>
				<Stack>
					<FormControl flex={1} isInvalid={!isFieldValid("naam")} isRequired={true}>
						<FormLabel>{t("forms.createAfdeling.naam")}</FormLabel>
						<Input
						 	autoComplete="no"
							aria-autocomplete="none"
							value={form.naam || ""}
							onChange={e => updateForm("naam", e.target.value)}
							data-test="input.createDepartment.name"
						/>
						<FormErrorMessage>{t("afspraakDetailView.invalidNaamError")}</FormErrorMessage>
					</FormControl>
				</Stack>

				<Stack align={"flex-end"}>
					<HStack justify={"flex-end"}>
						<Button data-test="buttonModal.cancel" type={"reset"} onClick={() => onCancel()}>{t("global.actions.cancel")}</Button>
						<Button data-test="buttonModal.submit" type={"submit"} colorScheme={"primary"}>{t("global.actions.save")}</Button>
					</HStack>
					<Asterisk />
				</Stack>
			</Stack>
		</form>
	);
};

export default AfdelingForm;
