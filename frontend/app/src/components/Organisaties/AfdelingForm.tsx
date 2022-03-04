import {Button, FormControl, FormErrorMessage, FormLabel, Input, Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {CreateAfdelingInput, Organisatie} from "../../generated/graphql";
import useForm from "../../utils/useForm";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import Asterisk from "../shared/Asterisk";

const validator = zod.object({
	naam: zod.string().nonempty(),
});

type AfdelingFormProps = {
    organisatie: Organisatie,
    onChange: (values) => void,
    onCancel: VoidFunction,
    values?: Partial<CreateAfdelingInput>,
};

const AfdelingForm: React.FC<AfdelingFormProps> = ({values, organisatie, onChange, onCancel}) => {
	const toast = useToaster();
	const {t} = useTranslation();
	const [form, {updateForm, toggleSubmitted, isFieldValid, isValid}] = useForm<zod.infer<typeof validator>>({
		validator,
		initialValue: values,
	});

	const onSubmit = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		if (isValid()) {
			onChange({
				...form,
				organisatieId: organisatie.id,
			});
			return;
		}

		toast({error: t("global.formError"), title: t("messages.genericError.title")});
	};

	return (
		<form onSubmit={onSubmit}>
			<Stack spacing={5}>

				<Stack>
					<FormControl flex={1} isInvalid={!isFieldValid("naam")} isRequired={true}>
						<FormLabel>{t("forms.createAfdeling.naam")}</FormLabel>
						<Input value={form.naam || ""} onChange={e => updateForm("naam", e.target.value)} />
						<FormErrorMessage>{t("afspraakDetailView.invalidNaamError")}</FormErrorMessage>
					</FormControl>
				</Stack>

				<Stack direction={"row"} justify={"flex-end"}>
					<Button type={"reset"} onClick={() => onCancel()}>{t("global.actions.cancel")}</Button>
					<Button type={"submit"} colorScheme={"primary"}>{t("global.actions.save")}</Button>
				</Stack>
				<Stack direction={"row"} justify={"flex-end"}>
					<Asterisk />
				</Stack>
			</Stack>
		</form>
	);
};

export default AfdelingForm;