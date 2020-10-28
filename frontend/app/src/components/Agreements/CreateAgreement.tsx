import React from "react";
import {useTranslation} from "react-i18next";
import {Box, Button, Divider, Flex, FormHelperText, FormLabel, Heading, Input, Stack, useToast} from "@chakra-ui/core";
import {useInput, useIsMobile, useToggle, Validators} from "react-grapple";
import BackButton from "../BackButton";
import Routes from "../../config/routes";
import {isDev, MOBILE_BREAKPOINT, Regex} from "../../utils/things";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import {useMutation} from "@apollo/client";
import {sampleData} from "../../config/sampleData/sampleData";
import {useHistory} from "react-router-dom";
import {CreateAgreementMutation} from "../../services/graphql/mutations";
import {UseInput} from "react-grapple/dist/hooks/useInput";

// Todo: add more detailed error message per field?
const CreateAgreement = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const isMobile = useIsMobile(MOBILE_BREAKPOINT);
	const toast = useToast();
	const [isSubmitted, toggleSubmitted] = useToggle(false);

	const gebruiker = useInput({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(/^[0-9]{8}$/).test(v)]
	});
	const beschrijving = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const start_datum = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const eind_datum = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const interval = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const tegen_rekening = useInput({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(Regex.ZipcodeNL).test(v)],
		placeholder: "1234AB"
	});
	const bedrag = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const kenmerk = useInput({
		defaultValue: "",
		validate: [Validators.required]
    });

	const [createAgreement, {loading}] = useMutation(CreateAgreementMutation);

	const prePopulateForm = () => {
		const c = sampleData.agreements[Math.floor(Math.random() * sampleData.agreements.length)];

		gebruiker.setValue(c.gebruiker.toString());
		beschrijving.setValue(c.beschrijving);
		start_datum.setValue(c.start_datum);
		eind_datum.setValue(c.eind_datum);
		interval.setValue(c.interval);
		tegen_rekening.setValue(c.tegen_rekening);
        bedrag.setValue(c.bedrag);
        kenmerk.setValue(c.kenmerk);
	}

	const onSubmit = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		const isFormValid = [
			gebruiker,
			beschrijving,
			start_datum,
			eind_datum,
			interval,
			tegen_rekening,
            bedrag,
            kenmerk,
		].every(f => f.isValid);

		if (!isFormValid) {
			toast({
				status: "error",
				title: t("messages.organizations.invalidFormMessage"),
				position: "top",
			});
			return;
		}

		createAgreement({
			variables: {
				gebruiker: gebruiker.value,
				beschrijving: beschrijving.value,
				start_datum: start_datum.value,
				eind_datum: eind_datum.value,
				interval: interval.value,
				tegen_rekening: tegen_rekening.value,
				bedrag: bedrag.value,
				kenmerk: kenmerk.value,
			}
		}).then(result => {
			toast({
				status: "success",
				title: t("messages.organizations.createSuccessMessage"),
				position: "top",
			});

			const {id} = result.data.createAfspraak.afspraak;
			if (id) {
				// todo: need afspraak detail page
				//push(Routes.Afspraak(id));
			}
		}).catch(err => {
			console.log("Error:", err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				title: t("messages.genericError.title"),
				description: t("messages.genericError.description"),
			});
		});
	};

	const isInvalid = (input: UseInput) => (input.dirty || isSubmitted) && !input.isValid;

	return (<>
		<BackButton to={Routes.AgreementsNew} />

		<Stack spacing={5}>
			<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
				<Stack>
					<Heading size={"lg"}>{t("forms.agreements.title")}</Heading>
				</Stack>
			</Stack>

			{isDev && (
				<Flex justifyContent={"center"}>
					<Button maxWidth={350} variantColor={"yellow"} variant={"outline"} onClick={() => prePopulateForm()}>Formulier snel invullen met testdata</Button>
				</Flex>
			)}

			<Box as={"form"} onSubmit={onSubmit}>
				<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft>
							<Heading size={"md"}>{t("forms.agreements.sections.pt1.title")}</Heading>
							<FormHelperText id="personal-helperText">{t("forms.agreements.sections.pt1.helperText")}</FormHelperText>
						</FormLeft>
						<FormRight>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"gebruiker"}>{t("forms.agreements.fields.gebruiker")}</FormLabel>
									<Input isInvalid={isInvalid(gebruiker)} {...gebruiker.bind} id="gebruiker" />
								</Stack>
							</Stack>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"beschrijving"}>{t("forms.agreements.fields.beschrijving")}</FormLabel>
									<Input isInvalid={isInvalid(beschrijving)} {...beschrijving.bind} id="beschrijving" />
								</Stack>
							</Stack>
                            <Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"start_datum"}>{t("forms.agreements.fields.start_datum")}</FormLabel>
									<Input isInvalid={isInvalid(start_datum)} {...start_datum.bind} id="start_datum" />
								</Stack>
							</Stack>
                            <Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"eind_datum"}>{t("forms.agreements.fields.eind_datum")}</FormLabel>
									<Input isInvalid={isInvalid(eind_datum)} {...eind_datum.bind} id="eind_datum" />
								</Stack>
							</Stack>
						</FormRight>
					</Stack>

					<Divider />

					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft>
							<Heading size={"md"}>{t("forms.agreements.sections.pt2.title")}</Heading>
							<FormHelperText>{t("forms.agreements.sections.pt2.helperText")}</FormHelperText>
						</FormLeft>
						<FormRight>
                            <Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"interval"}>{t("forms.agreements.fields.interval")}</FormLabel>
									<Input isInvalid={isInvalid(interval)} {...interval.bind} id="interval" />
								</Stack>
							</Stack>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"tegen_rekening"}>{t("forms.agreements.fields.tegen_rekening")}</FormLabel>
									<Input isInvalid={isInvalid(tegen_rekening)} {...tegen_rekening.bind} id="tegen_rekening" />
								</Stack>
							</Stack>
                            <Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"bedrag"}>{t("forms.agreements.fields.bedrag")}</FormLabel>
									<Input isInvalid={isInvalid(bedrag)} {...bedrag.bind} id="bedrag" />
								</Stack>
							</Stack>
                            <Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<Stack spacing={1} flex={2}>
									<FormLabel htmlFor={"kenmerk"}>{t("forms.agreements.fields.kenmerk")}</FormLabel>
									<Input isInvalid={isInvalid(kenmerk)} {...kenmerk.bind} id="kenmerk" />
								</Stack>
							</Stack>
						</FormRight>
					</Stack>

					<Divider />

					<Stack direction={isMobile ? "column" : "row"} spacing={2}>
						<FormLeft />
						<FormRight>
							<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
								<Button isLoading={loading} type={"submit"} variantColor={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
							</Stack>
						</FormRight>
					</Stack>
				</Stack>
			</Box>
		</Stack>
	</>);
};

export default CreateAgreement;