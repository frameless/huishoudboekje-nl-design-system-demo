import {Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftElement, Radio, RadioGroup, Spinner, Stack} from "@chakra-ui/react";
import React, {useContext, useEffect} from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Afdeling, Organisatie, Postadres, Rekening, UpdateAfspraakInput, useGetOrganisatieLazyQuery} from "../../generated/graphql";
import {useReactSelectStyles} from "../../utils/things";
import useForm from "../../utils/useForm";
import useSelectProps from "../../utils/useSelectProps";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import Asterisk from "../shared/Asterisk";
import {Section} from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import AfspraakFormContext from "./EditAfspraak/context";
import d from "../../utils/dayjs";
import DatePicker from "react-datepicker";

/**
 * This validator2 is required because Zod doesn't execute the superRefine directly, but only after the initial set of rules all pass.
 * See https://github.com/colinhacks/zod/issues/586 for this issue.
 * In order to mark the related fields in the UI as invalid, we need an additional validator that will work from the start.
 */
const validator2 = zod.object({
	organisatieId: zod.number().nonnegative(),
	afdelingId: zod.number().nonnegative(),
	postadresId: zod.string().min(1),
});

const validator = zod.object({
	type: zod.enum(["burger", "organisatie"]),
	bedrag: zod.number().min(0).finite(),
	rubriekId: zod.number().nonnegative(),
	omschrijving: zod.string().min(1).max(140, {message: 'Gebruik maximaal 140 tekens.'}),
	organisatieId: zod.number().nonnegative().optional(),
	afdelingId: zod.number().nonnegative().optional(),
	postadresId: zod.string().min(1).optional(),
	tegenRekeningId: zod.number().nonnegative(),
	credit: zod.boolean(),
	validFrom: zod.string()
}).superRefine((data, ctx) => {
	// Only require organisatieId, afdelingId and postadresId when type === organisatie.
	if (data.type === "organisatie") {
		const {organisatieId, afdelingId, postadresId} = data;

		const parsed = validator2.safeParse({
			organisatieId, afdelingId, postadresId,
		});

		if (!parsed.success) {
			parsed.error.issues.forEach(ctx.addIssue);
		}
	}
});

type AfspraakFormProps = {
	burgerRekeningen: Rekening[],
	onSubmit: (values) => void,
	organisatie?: Organisatie,
	values?: UpdateAfspraakInput,
	isLoading?: boolean
};

const createInitialValues = (data, organisatiesId): Partial<zod.infer<typeof validator>> => {
	if (!data) {
		return {
			validFrom: d().format("YYYY-MM-DD")
		};
	}
	return {
		type: data?.afdelingId ? "organisatie" : "burger",
		afdelingId: data?.afdelingId,
		bedrag: data?.bedrag,
		credit: data?.credit,
		omschrijving: data?.omschrijving,
		organisatieId: organisatiesId,
		postadresId: data?.postadresId,
		rubriekId: data?.rubriekId,
		tegenRekeningId: data?.tegenRekeningId,
		validFrom: data?.validFrom
	};
};

const AfspraakForm: React.FC<AfspraakFormProps> = ({values, burgerRekeningen, organisatie, onSubmit, isLoading = false}) => {
	const toast = useToaster();
	const {t} = useTranslation();
	const [form, {updateForm, setForm, toggleSubmitted, isSubmitted, isValid, isFieldValid, capInput}] = useForm<zod.infer<typeof validator>>({
		validator,
		initialValue: values,
	});
	const isFieldValid2 = (field: string) => {
		if (!isSubmitted || form.type !== "organisatie") {
			return true;
		}

		const {organisatieId, afdelingId, postadresId} = form;
		const parsed = validator2.safeParse({organisatieId, afdelingId, postadresId});
		return parsed.success || !parsed.error.issues.find(issue => issue.path?.[0] === field);
	};
	const reactSelectStyles = useReactSelectStyles();
	const {
		defaultProps,
		components,
		createSelectOptionsFromRekeningen,
		createSelectOptionsFromRubrieken,
		createSelectOptionsFromOrganisaties,
		createSelectOptionsFromAfdelingen,
		createSelectOptionsFromPostadressen,
	} = useSelectProps();

	const {
		organisaties = [],
		rubrieken = [],
	} = useContext(AfspraakFormContext);

	const [getOrganisatie, $organisatie] = useGetOrganisatieLazyQuery();

	const getSelectedOrganisatie = (organisatieId) => {
		let selected: Organisatie | undefined = undefined;
		if (organisatie && organisatieId === organisatie.id) {
			selected = organisatie
		}
		else {
			selected = $organisatie.data?.organisatie
		}
		return selected
	}

	const selectedOrganisatie = form.organisatieId ? getSelectedOrganisatie(form.organisatieId) : undefined
	const afdelingen = selectedOrganisatie?.afdelingen || [];
	const rekeningen = afdelingen.find(a => a.id === form.afdelingId)?.rekeningen || [];
	const postadressen = afdelingen.find(a => a.id === form.afdelingId)?.postadressen || [];

	useEffect(() => {
		setForm(createInitialValues(values, organisatie ? organisatie.id : undefined));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [values, organisaties]);

	const rubriekOptions = createSelectOptionsFromRubrieken(rubrieken.filter(r => r.grootboekrekening?.credit === form.credit));
	const organisatieOptions = createSelectOptionsFromOrganisaties(organisaties);
	const afdelingOptions = createSelectOptionsFromAfdelingen(afdelingen);
	const rekeningOptions = createSelectOptionsFromRekeningen(form.type === "organisatie" ? rekeningen : burgerRekeningen);
	const postadresOptions = createSelectOptionsFromPostadressen(postadressen);

	const onSubmitForm = (e) => {
		e.preventDefault();

		toggleSubmitted(true);

		if (isValid()) {
			const values = structuredClone(form)
			delete values.type;
			delete values.organisatieId;

			onSubmit({
				...values,
				afdelingId: values.afdelingId || null, // Explicitly pass to make it null.
				postadresId: values.postadresId || null, // Explicitly pass to make it null.
			});
			return;
		}

		toast.closeAll();
		toast({
			title: t("messages.genericError.title"),
			error: t("global.formError"),

		});
	};

	const tryAutofillFields = (afdeling?: Afdeling) => {
		if (!afdeling) {
			return;
		}

		updateForm("afdelingId", afdeling.id);

		/* If the afdeling has only one postadres, fill it in */
		const postadressen: Postadres[] = afdeling.postadressen || [];
		if (postadressen.length === 1) {
			updateForm("postadresId", postadressen[0].id);
		}

		/* If the afdeling has only one rekening, fill it in */
		const rekeningen: Rekening[] = afdeling.rekeningen || [];
		if (rekeningen.length === 1) {
			updateForm("tegenRekeningId", rekeningen[0].id);
		}
	};

	return isLoading ? (
		<Stack justify={"center"} align={"center"}>
			<Spinner />
		</Stack>
	) : (
		<Stack spacing={5}>
			<form onSubmit={onSubmitForm}>
				<SectionContainer>

					<Section title={t("forms.afspraken.section1.title")} helperText={t("forms.afspraken.section1.helperText")}>
						<Stack spacing={5}>
							<Stack direction={["column", "row"]}>
								<FormControl flex={1} isInvalid={!isFieldValid("type")} isRequired>
									<FormLabel>{t("afspraken.isAfspraakWithOrganisatie")}</FormLabel>
									<RadioGroup colorScheme={"primary"} value={form.type || ""} onChange={result => {
										updateForm("type", result);
										updateForm("organisatieId", undefined);
										updateForm("afdelingId", undefined);
										updateForm("tegenRekeningId", undefined);
										updateForm("postadresId", undefined);
									}}>
										<Stack>
											<Radio value={"organisatie"}>{t("organisatie")}</Radio>
											<Radio value={"burger"}>{t("burger")}</Radio>
										</Stack>
									</RadioGroup>
									<FormErrorMessage>{t("afspraakForm.invalidTypeError")}</FormErrorMessage>
								</FormControl>
							</Stack>

							{form.type === "organisatie" && (<>
								<Stack direction={["column", "row"]}>
									<FormControl flex={1} isInvalid={!isFieldValid("organisatieId") || !isFieldValid2("organisatieId")} isRequired>
										<FormLabel>{t("organisatie")}</FormLabel>
										<Select
											{...defaultProps}
											id={"organisatie"}
											options={organisatieOptions}
											value={form.organisatieId ? selectedOrganisatie ? organisatieOptions.find(o => o.value === selectedOrganisatie.id) : null : null}
											styles={isFieldValid("organisatieId") && isFieldValid2("organisatieId") ? reactSelectStyles.default : reactSelectStyles.error}
											onChange={result => {
												const organisatieId = result?.value;
												if (organisatieId !== null && organisatieId !== undefined) {
													updateForm("organisatieId", organisatieId)
													updateForm("afdelingId", undefined);
													updateForm("postadresId", undefined);
													updateForm("tegenRekeningId", undefined);
													getOrganisatie({
														variables: {id: Number(organisatieId)},
														onCompleted: (data) => {
															/* If the organisatie has only one afdeling, fill it in */
															const afdelingen: Afdeling[] = data?.organisatie?.afdelingen || [];
															if (afdelingen.length === 1) {
																tryAutofillFields(afdelingen[0]);
															}
														}
													})
												}
												else {
													updateForm("organisatieId", undefined);
													updateForm("afdelingId", undefined);
													updateForm("postadresId", undefined);
													updateForm("tegenRekeningId", undefined);
												}
												/* If the organisatie has only one afdeling, fill it in */
												const afdelingen: Afdeling[] = organisatie?.afdelingen || [];
												if (afdelingen.length === 1) {
													tryAutofillFields(afdelingen[0]);
												}
											}}
										/>
										<FormErrorMessage>{t("forms.afspraak.invalidOrganisatieError")}</FormErrorMessage>
									</FormControl>
								</Stack>

								<Stack direction={["column", "row"]}>
									<FormControl flex={1} isInvalid={!isFieldValid("afdelingId") || !isFieldValid2("afdelingId")} isRequired>
										<FormLabel>{t("afdeling")}</FormLabel>
										<Select
											{...defaultProps}
											id={"afdeling"}
											noOptionsMessage={() => t("forms.afspraken.select.noAfdelingenOptionsMessage")}
											options={afdelingOptions}
											value={form.afdelingId ? afdelingOptions.find(o => o.value === form.afdelingId) : null}
											styles={isFieldValid("afdelingId") && isFieldValid2("afdelingId") ? reactSelectStyles.default : reactSelectStyles.error}
											onChange={result => {
												const findAfdeling = afdelingen.find(o => o.id === result?.value);
												updateForm("afdelingId", findAfdeling?.id);
												tryAutofillFields(findAfdeling);
											}}
										/>
										<FormErrorMessage>{t("forms.afspraak.invalidAfdelingError")}</FormErrorMessage>
									</FormControl>
								</Stack>

								<Stack direction={["column", "row"]}>
									<FormControl flex={1} isInvalid={!isFieldValid("postadresId") || !isFieldValid2("postadresId")} isRequired>
										<FormLabel>{t("postadres")}</FormLabel>
										<Select
											{...defaultProps}
											id={"postadres"}
											noOptionsMessage={() => t("forms.afspraken.select.noPostadressenOptionsMessage")}
											options={postadresOptions}
											value={form.postadresId ? postadresOptions.find(o => o.value === form.postadresId) : null}
											styles={isFieldValid("postadresId") && isFieldValid2("postadresId") ? reactSelectStyles.default : reactSelectStyles.error}
											onChange={(result) => {
												const findPostadres = postadressen.find(o => o.id === result?.value);
												updateForm("postadresId", findPostadres?.id);
											}}
										/>
										<FormErrorMessage>{t("forms.afspraak.invalidPostadresError")}</FormErrorMessage>
									</FormControl>
								</Stack>

								<Stack direction={["column", "row"]}>
									<FormControl flex={1} isInvalid={!isFieldValid("tegenRekeningId")} isRequired>
										<FormLabel>{t("afspraken.tegenrekening")}</FormLabel>
										<Select
											{...defaultProps}
											id={"tegenrekening"}
											components={components.ReverseMultiLine}
											noOptionsMessage={() => t("forms.afspraken.select.noRekeningenOptionsMessage")}
											options={rekeningOptions}
											value={form.tegenRekeningId ? rekeningOptions.find(o => o.value === form.tegenRekeningId) : null}
											styles={isFieldValid("tegenRekeningId") ? reactSelectStyles.default : reactSelectStyles.error}
											onChange={(result) => updateForm("tegenRekeningId", result?.value)}
										/>
										<FormErrorMessage>{t("forms.afspraak.invalidRekeningError")}</FormErrorMessage>
									</FormControl>
								</Stack>
							</>)}

							{form.type === "burger" && (
								<Stack direction={["column", "row"]}>
									<FormControl flex={1} isInvalid={!isFieldValid("tegenRekeningId")} isRequired>
										<FormLabel>{t("afspraken.tegenrekening")}</FormLabel>
										<Select
											{...defaultProps}
											id={"tegenrekening"}
											components={components.ReverseMultiLine}
											noOptionsMessage={() => t("forms.afspraken.select.noRekeningenOptionsMessage")}
											options={rekeningOptions}
											value={form.tegenRekeningId ? rekeningOptions.find(o => o.value === form.tegenRekeningId) : rekeningOptions.find(o => o.value === "empty")}
											styles={isFieldValid("tegenRekeningId") ? reactSelectStyles.default : reactSelectStyles.error}
											onChange={(result) => updateForm("tegenRekeningId", result?.value)}
										/>
										<FormErrorMessage>{t("forms.afspraak.invalidRekeningError")}</FormErrorMessage>
									</FormControl>
								</Stack>
							)}
						</Stack>
					</Section>
					<Section title={t("forms.afspraken.section2.title")} helperText={t("forms.afspraken.section2.helperText")}>
						<Stack spacing={5}>

							<Stack direction={["column", "row"]}>
								<FormControl flex={1} isInvalid={!isFieldValid("credit")} isRequired>
									<FormLabel>{t("afspraken.betaalrichting")}</FormLabel>
									<RadioGroup colorScheme={"primary"} onChange={e => {
										updateForm("credit", e === "inkomsten");
										updateForm("rubriekId", undefined);
									}} value={form.credit !== undefined ? form.credit ? "inkomsten" : "uitgaven" : undefined}>
										<Stack>
											<Radio value={"inkomsten"}>{t("afspraken.inkomsten")}</Radio>
											<Radio value={"uitgaven"}>{t("afspraken.uitgaven")}</Radio>
										</Stack>
									</RadioGroup>
									<FormErrorMessage>{t("afspraakDetailView.invalidBetaalrichtingError")}</FormErrorMessage>
								</FormControl>
							</Stack>

							{form.credit !== undefined && (<>
								<Stack direction={["column", "row"]}>
									<FormControl flex={1} isInvalid={!isFieldValid("rubriekId")} isRequired>
										<FormLabel>{t("afspraken.rubriek")}</FormLabel>
										<Select id={"rubriek"} isClearable={true} noOptionsMessage={() => t("forms.afspraken.fields.rubriekChoose")} placeholder={t("select.placeholder")} maxMenuHeight={350}
											options={rubriekOptions} value={form.rubriekId ? rubriekOptions.find(r => r.value === form.rubriekId) : null}
											onChange={(result) => updateForm("rubriekId", result?.value)} styles={isFieldValid("rubriekId") ? reactSelectStyles.default : reactSelectStyles.error} />
										<FormErrorMessage>{t("afspraakDetailView.invalidRubriekError")}</FormErrorMessage>
									</FormControl>

									<FormControl flex={1} isInvalid={!isFieldValid("omschrijving")} isRequired={true}>
										<FormLabel>{t("afspraken.omschrijving")}</FormLabel>
										<Input
											autoComplete="no"
											aria-autocomplete="none"
											value={form.omschrijving || ""}
											onChange={e => updateForm("omschrijving", e.target.value)}
											maxLength={141}
										/>
										<FormErrorMessage>{t("afspraakDetailView.invalidOmschrijvingError")}</FormErrorMessage>
									</FormControl>
								</Stack>

								<Stack direction={["column", "row"]}>
									<FormControl flex={1} isInvalid={!(isFieldValid("bedrag") && capInput("bedrag", 20000000))} isRequired>
										<FormLabel>{t("afspraken.bedrag")}</FormLabel>
										<InputGroup>
											<InputLeftElement zIndex={0}>&euro;</InputLeftElement>
											<Input
											 	autoComplete="no"
												aria-autocomplete="none"
												flex={3}
												type={"number"}
												pattern={"^\\d*(,{0,1}\\d{0,2})$"}
												step={.01}
												min={0.00}
												value={form.bedrag || form.bedrag === 0 ? parseFloat(String(form.bedrag)) : ""}
												onKeyUp = {e => updateForm("bedrag", parseFloat((e.target as HTMLInputElement).value.toString().replace(",",".")))}
												onChange={e => updateForm("bedrag", parseFloat(e.target.value.toString().replace(",",".")))}
											/>
										</InputGroup>
										<FormErrorMessage>{t("afspraakDetailView.invalidBedragError")}</FormErrorMessage>
									</FormControl>
								</Stack>
							</>)}
						</Stack>
					</Section>
					<Section title={t("forms.afspraken.section3.title")} helperText={t("forms.afspraken.section3.helperText")}>
						<Stack direction={["column", "row"]}>
							<FormControl flex={1} isInvalid={!isFieldValid("validFrom")} isRequired>
								<FormLabel>{t("afspraken.startdatum")}</FormLabel>
								<InputGroup>
									<DatePicker selected={d(form.validFrom).toDate() || d()}
									 	autoComplete="no"
										aria-autocomplete="none"
										dateFormat={"dd-MM-yyyy"}
										startDate={d(form.validFrom).toDate()}
										isClearable={false}
										selectsRange={false}
										showYearDropdown
										dropdownMode={"select"}
										onChange={(date) => {
											if (date) {
												updateForm("validFrom", d(date).format("YYYY-MM-DD"))
											}
										}}
										customInput={(<Input autoComplete="no" aria-autocomplete="none" />)} />
								</InputGroup>
								<FormErrorMessage>{t("afspraakDetailView.invalidValidFromError")}</FormErrorMessage>
							</FormControl>
						</Stack>
						<Stack marginTop={5} align={"flex-end"}>
							<Button type={"submit"} colorScheme={"primary"}>{t("global.actions.save")}</Button>
							<Asterisk />
						</Stack>
					</Section>
				</SectionContainer>
			</form>
		</Stack>
	);
};

export default AfspraakForm;
