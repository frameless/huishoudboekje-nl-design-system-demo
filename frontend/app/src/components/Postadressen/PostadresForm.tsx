import {Button, FormControl, FormErrorMessage, FormLabel, Input, Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Postadres} from "../../generated/graphql";
import {Regex} from "../../utils/things";
import useForm from "../../utils/useForm";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";

const validator = zod.object({
	straatnaam: zod.string().nonempty(),
	huisnummer: zod.string().nonempty(),
	postcode: zod.string().regex(Regex.ZipcodeNL),
	plaatsnaam: zod.string().nonempty(),
});

type PostadresFormProps = {
	postadres?: Postadres,
	onSubmit: Function,
	onCancel: VoidFunction,
};

const PostadresForm: React.FC<PostadresFormProps> = ({postadres, onSubmit, onCancel}) => {
	const {t} = useTranslation();
	const toast = useToaster();

	const {straatnaam, huisnummer, postcode, plaatsnaam} = postadres || {};
	const [form, {updateForm, toggleSubmitted, isValid, isFieldValid}] = useForm<zod.infer<typeof validator>>({
		validator,
		initialValue: {
			straatnaam, huisnummer, postcode, plaatsnaam,
		},
	});

	const onSubmitForm = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		if (isValid()) {
			onSubmit(form);
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

				<FormControl isInvalid={!isFieldValid("straatnaam")} id={"straatnaam"}>
					<FormLabel>{t("forms.postadressen.fields.straatnaam")}</FormLabel>
					<Input onChange={e => updateForm("straatnaam", e.target.value)} value={form.straatnaam || ""} autoFocus />
					<FormErrorMessage>{t("errors.straatnaam.generalError")}</FormErrorMessage>
				</FormControl>

				<FormControl isInvalid={!isFieldValid("huisnummer")} id={"huisnummer"}>
					<FormLabel>{t("forms.postadressen.fields.huisnummer")}</FormLabel>
					<Input onChange={e => updateForm("huisnummer", e.target.value)} value={form.huisnummer || ""} />
					<FormErrorMessage>{t("errors.huisnummer.generalError")}</FormErrorMessage>
				</FormControl>

				<FormControl isInvalid={!isFieldValid("postcode")} id={"postcode"}>
					<FormLabel>{t("forms.postadressen.fields.postcode")}</FormLabel>
					<Input onChange={e => updateForm("postcode", e.target.value)} value={form.postcode || ""} />
					<FormErrorMessage>{t("errors.postcode.generalError")}</FormErrorMessage>
				</FormControl>

				<FormControl isInvalid={!isFieldValid("plaatsnaam")} id={"plaatsnaam"}>
					<FormLabel>{t("forms.postadressen.fields.plaatsnaam")}</FormLabel>
					<Input onChange={e => updateForm("plaatsnaam", e.target.value)} value={form.plaatsnaam || ""} />
					<FormErrorMessage>{t("errors.plaatsnaam.generalError")}</FormErrorMessage>
				</FormControl>

				<Stack direction={"row"} alignItems={"flex-end"}>
					<Button type={"reset"} onClick={() => onCancel()}>{t("global.actions.cancel")}</Button>
					<Button type={"submit"} colorScheme={"primary"} onClick={onSubmitForm}>{t("global.actions.save")}</Button>
				</Stack>

			</Stack>
		</form>
	);
};

export default PostadresForm;