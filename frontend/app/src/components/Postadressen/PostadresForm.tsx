import {Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Stack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Postadres} from "../../generated/graphql";
import useForm from "../../utils/useForm";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import usePostadresValidator from "../../validators/usePostadresValidator";
import Asterisk from "../shared/Asterisk";

type PostadresFormProps = {
	postadres?: Postadres,
	onChange: (values) => void,
	onCancel: VoidFunction,
};

const PostadresForm: React.FC<PostadresFormProps> = ({postadres, onChange, onCancel}) => {
	const validator = usePostadresValidator();
	const {t} = useTranslation();
	const toast = useToaster();

	const {straatnaam, huisnummer, postcode, plaatsnaam} = postadres || {};
	const [form, {updateForm, toggleSubmitted, isFieldValid}] = useForm<zod.infer<typeof validator>>({
		validator,
		initialValue: {
			straatnaam, huisnummer, postcode, plaatsnaam,
		},
	});

	const onSubmitForm = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		try {
			const data = validator.parse(form);
			onChange({
				...data,
				...postadres?.id && {
					postadresId: postadres.id,
				},
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

				<FormControl isInvalid={!isFieldValid("straatnaam")} id={"straatnaam"} isRequired={true}>
					<FormLabel>{t("forms.postadressen.fields.straatnaam")}</FormLabel>
					<Input
					 	autoComplete="no"
						aria-autocomplete="none"
						onChange={e => updateForm("straatnaam", e.target.value)}
						value={form.straatnaam || ""}
						autoFocus
					/>
					<FormErrorMessage>{t("errors.straatnaam.generalError")}</FormErrorMessage>
				</FormControl>

				<FormControl isInvalid={!isFieldValid("huisnummer")} id={"huisnummer"} isRequired={true}>
					<FormLabel>{t("forms.postadressen.fields.huisnummer")}</FormLabel>
					<Input
					 	autoComplete="no"
						aria-autocomplete="none"
						onChange={e => updateForm("huisnummer", e.target.value)}
						value={form.huisnummer || ""}
					/>
					<FormErrorMessage>{t("errors.huisnummer.generalError")}</FormErrorMessage>
				</FormControl>

				<FormControl isInvalid={!isFieldValid("postcode")} id={"postcode"} isRequired={true}>
					<FormLabel>{t("forms.postadressen.fields.postcode")}</FormLabel>
					<Input
					 	autoComplete="no"
						aria-autocomplete="none"
						onChange={e => updateForm("postcode", e.target.value)}
						value={form.postcode || ""}
					/>
					<FormErrorMessage>{t("errors.postcode.generalError")}</FormErrorMessage>
				</FormControl>

				<FormControl isInvalid={!isFieldValid("plaatsnaam")} id={"plaatsnaam"} isRequired={true}>
					<FormLabel>{t("forms.postadressen.fields.plaatsnaam")}</FormLabel>
					<Input
						autoComplete="no"
						aria-autocomplete="none"
						onChange={e => updateForm("plaatsnaam", e.target.value)}
						value={form.plaatsnaam || ""}
					/>
					<FormErrorMessage>{t("errors.plaatsnaam.generalError")}</FormErrorMessage>
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

export default PostadresForm;
