import {Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {CreateAfdelingInput, Organisatie} from "../../generated/graphql";
import useForm from "../../utils/useForm2";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";

const validator = zod.object({
	naam: zod.string().nonempty(),
});

type AfdelingFormProps = {
	organisatie: Organisatie,
	onChange: (values) => void,
	values?: Partial<CreateAfdelingInput>,
};

const AfdelingForm: React.FC<AfdelingFormProps> = ({values, organisatie, onChange}) => {
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

				<Box align={"right"}>
					<Button type={"submit"} colorScheme={"primary"}>{t("global.actions.save")}</Button>
				</Box>

			</Stack>
		</form>
	);
};

export default AfdelingForm;