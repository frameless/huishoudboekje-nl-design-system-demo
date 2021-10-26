import {Button, FormControl, FormErrorMessage, FormLabel, Input, SimpleGrid, Stack, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {CreatePostadresInput, Postadres} from "../../generated/graphql";
import useForm from "../../utils/useForm";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import PostadresValidator from "../../validators/PostadresValidator";

const useErrorMap = (t): zod.ZodErrorMap => (error, ctx) => {
	if (error.path.includes("iban")) {
		return {message: t("errors.iban.generalError")};
	}
	else if (error.path.includes("rekeninghouder")) {
		return {message: t("errors.rekeninghouder.generalError")};
	}

	return {message: ctx.defaultError};
};

const PostadresForm: React.FC<{
	postadres?: Postadres,
	onSubmit: (postadres: CreatePostadresInput, resetForm: VoidFunction) => void,
	onCancel: VoidFunction,
}> = ({postadres, onSubmit, onCancel}) => {
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {t} = useTranslation();
	const toast = useToaster();
	const errorMap = useErrorMap(t);
	const [formData, {updateForm, reset}] = useForm<keyof Omit<CreatePostadresInput, "afdelingId">, string | undefined>({
		huisnummer: postadres?.huisnummer,
		plaatsnaam: postadres?.plaatsnaam,
		postcode: postadres?.plaatsnaam,
		straatnaam: postadres?.straatnaam,
	});

	const isValid = (fieldName: string) => PostadresValidator.shape[fieldName]?.safeParse(formData[fieldName]).success;

	const onSubmitForm = (e) => {
		e.preventDefault();

		try {
			const data = PostadresValidator.parse(formData, {errorMap});
			onSubmit({
				...(postadres || {}),
				...data,
			}, () => {
				reset();
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
					<FormControl isInvalid={!isValid("straatnaam")} id={"straatnaam"}>
						<FormLabel>{t("forms.postadressen.fields.straatnaam")}</FormLabel>
						<Input onChange={e => updateForm("straatnaam", e.target.value)} value={formData.straatnaam || ""} autoFocus />
						<FormErrorMessage>{t("errors.straatnaam.generalError")}</FormErrorMessage>
					</FormControl>
				</Stack>
				<Stack spacing={1}>
					<FormControl isInvalid={!isValid("huisnummer")} id={"huisnummer"}>
						<FormLabel>{t("forms.postadressen.fields.huisnummer")}</FormLabel>
						<Input onChange={e => updateForm("huisnummer", e.target.value)} value={formData.huisnummer || ""} />
						<FormErrorMessage>{t("errors.huisnummer.generalError")}</FormErrorMessage>
					</FormControl>
				</Stack>
				<Stack spacing={1}>
					<FormControl isInvalid={!isValid("postcode")} id={"postcode"}>
						<FormLabel>{t("forms.postadressen.fields.postcode")}</FormLabel>
						<Input onChange={e => updateForm("postcode", e.target.value)} value={formData.postcode || ""} />
						<FormErrorMessage>{t("errors.postcode.generalError")}</FormErrorMessage>
					</FormControl>
				</Stack>
				<Stack spacing={1}>
					<FormControl isInvalid={!isValid("plaatsnaam")} id={"plaatsnaam"}>
						<FormLabel>{t("forms.postadressen.fields.plaatsnaam")}</FormLabel>
						<Input onChange={e => updateForm("plaatsnaam", e.target.value)} value={formData.plaatsnaam || ""} />
						<FormErrorMessage>{t("errors.plaatsnaam.generalError")}</FormErrorMessage>
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

export default PostadresForm;