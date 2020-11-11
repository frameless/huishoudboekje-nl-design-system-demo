import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {
	Box,
	Button,
	Divider,
	FormHelperText,
	FormLabel,
	Heading,
	Input,
	InputGroup,
	InputLeftElement,
	RadioButtonGroup,
	RadioProps,
	Select,
	Spinner,
	Stack,
	Switch,
	useToast,
} from "@chakra-ui/core";
import {useInput, useIsMobile, useNumberInput, useToggle, Validators} from "react-grapple";
import BackButton from "../BackButton";
import Routes from "../../config/routes";
import {Interval, isDev, MOBILE_BREAKPOINT} from "../../utils/things";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import {useMutation, useQuery} from "@apollo/client";
import {sampleData} from "../../config/sampleData/sampleData";
import {Redirect, useHistory, useParams} from "react-router-dom";
import {CreateAfspraakMutation} from "../../services/graphql/mutations";
import {GetAllOrganisatiesQuery, GetOneGebruikerQuery} from "../../services/graphql/queries";
import {AfspraakPeriod, AfspraakType, IGebruiker, IntervalType, IOrganisatie} from "../../models";
import {UseInput} from "react-grapple/dist/hooks/useInput";
import moment from "moment";

const CreateAgreement = () => {
	const {t} = useTranslation();
	const {burgerId} = useParams();
	const {push} = useHistory();
	const isMobile = useIsMobile(MOBILE_BREAKPOINT);
	const toast = useToast();
	const [isSubmitted, setSubmitted] = useState<boolean>(false);

	const {data: gebruikerData, loading: gebruikerLoading, error: gebruikerError} = useQuery<{ gebruiker: IGebruiker }>(GetOneGebruikerQuery, {
		variables: {
			id: burgerId
		}
	});
	const {data: orgsData, loading: orgsLoading} = useQuery<{ organisaties: IOrganisatie[] }>(GetAllOrganisatiesQuery);

	const [afspraakType, setAfspraakType] = useState<AfspraakType>(AfspraakType.Expense);
	const description = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const organizationId = useInput<number>({
		validate: [(v) => v !== undefined && v.toString() !== ""]
	});
	const rekeningId = useInput<number>({
		validate: [(v) => v !== undefined && v.toString() !== ""]
	});
	const amount = useNumberInput({
		min: 0,
		step: .01,
		validate: [v => new RegExp(/^([0-9]+)((,|\.)[0-9]{2})?$/).test(v.toString())]
	});
	const searchTerm = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const [isRecurring, toggleRecurring] = useToggle(false);
	const startDate = {
		day: useNumberInput({
			validate: [(v) => new RegExp(/^[0-9]{1,2}$/).test(v.toString())],
			placeholder: t("forms.common.fields.dateDay"),
			min: 1,
			max: 31,
		}),
		month: useNumberInput({
			validate: [(v) => new RegExp(/^[0-9]{1,2}$/).test(v.toString())],
			placeholder: t("forms.common.fields.dateMonth"),
			min: 1, max: 12
		}),
		year: useNumberInput({
			validate: [(v) => new RegExp(/^[0-9]{4}$/).test(v.toString())],
			placeholder: t("forms.common.fields.dateYear"),
		})
	}
	const [isContinuous, toggleContinuous] = useToggle(true);
	const nTimes = useNumberInput({
		validate: [(v) => new RegExp(/^[0-9]+$/).test(v.toString())]
	});
	const intervalType = useInput<IntervalType>({
		defaultValue: "month",
		validate: [(v) => ["day", "week", "month", "year"].includes(v)]
	})
	const intervalNumber = useInput({
		defaultValue: "",
		validate: [v => !isNaN(parseInt(v))]
	});

	const [createAfspraak, {loading}] = useMutation(CreateAfspraakMutation);

	const prePopulateForm = () => {
		const c = sampleData.agreements[0];

		setAfspraakType(c.type);
		description.setValue(c.omschrijving);
		organizationId.setValue(c.organisatie.id);
		if(c.organisatie?.rekeningen?.length > 0){
			rekeningId.setValue(c.organisatie.rekeningen[0].id);
		}
		amount.setValue(c.bedrag);
		searchTerm.setValue(c.kenmerk);
		toggleRecurring(c.type === AfspraakPeriod.Periodic);
		intervalType.setValue("month");
		intervalNumber.setValue("3");
		startDate.day.setValue(c.startDatum.split("-")[2]);
		startDate.month.setValue(c.startDatum.split("-")[1]);
		startDate.year.setValue(c.startDatum.split("-")[0]);
		toggleContinuous(c.isContinuous);
		nTimes.setValue(10);
	}

	const onSubmit = (e) => {
		e.preventDefault();
		setSubmitted(true);

		const fields: UseInput<any>[] = [
			description,
			organizationId,
			rekeningId,
			amount,
			searchTerm,
			startDate.day,
			startDate.month,
			startDate.year,
		];

		if (isRecurring) {
			fields.push(intervalType);
			fields.push(intervalNumber);

			if (!isContinuous) {
				fields.push(nTimes);
			}
		}

		const formValid = fields.every(f => f.isValid);
		if (!formValid) {
			toast({
				status: "error",
				title: t("messages.agreements.invalidFormMessage"),
				position: "top",
			});
			return;
		}

		const startDatum = new Date(Date.UTC(startDate.year.value, startDate.month.value - 1, startDate.day.value));

		createAfspraak({
			variables: {
				gebruikerId: gebruikerData?.gebruiker.id,
				credit: afspraakType === AfspraakType.Income,
				beschrijving: description.value,
				tegenRekeningId: rekeningId.value,
				organisatieId: organizationId.value,
				bedrag: amount.value,
				kenmerk: searchTerm.value,
				startDatum: moment(startDatum).format("YYYY-MM-DD"),
				interval: isRecurring ? Interval.create(intervalType.value, intervalNumber.value) : null,
				aantalBetalingen: !isContinuous ? nTimes.value : null,
				actief: true,
			}
		}).then(result => {
			toast({
				status: "success",
				title: t("messages.agreements.createSuccessMessage"),
				position: "top",
			});
			push(Routes.Burger(burgerId))
		}).catch(err => {
			console.error(err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				title: t("messages.genericError.title"),
				description: t("messages.genericError.description"),
			});
		});
	};

	const isInvalid = (input) => (input.dirty || isSubmitted) && !input.isValid;

	const renderPageContent = () => {
		if (gebruikerLoading) {
			return (
				<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
					<Spinner />
				</Stack>
			);
		}

		if (gebruikerError) {
			return (<Redirect to={Routes.NotFound} />);
		}

		const onChangeAfspraakType = val => {
			if (val) {
				setAfspraakType(val);
			}
		};

		if (gebruikerData) {
			return (
				<Stack spacing={5}>
					<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
						<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
							<Heading size={"lg"}>{gebruikerData.gebruiker.voornamen} {gebruikerData.gebruiker.achternaam}</Heading>
						</Stack>
					</Stack>

					{isDev && (
						<Button maxWidth={350} variantColor={"yellow"} variant={"outline"} onClick={() => prePopulateForm()}>Formulier snel invullen met testdata</Button>
					)}

					<Box as={"form"} onSubmit={onSubmit}>
						<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<FormLeft>
									<Heading size={"md"}>{t("forms.agreements.sections.0.title")}</Heading>
									<FormHelperText id="personal-helperText">{t("forms.agreements.sections.0.helperText")}</FormHelperText>
								</FormLeft>
								<FormRight>
									<Stack spacing={2} direction={isMobile ? "column" : "row"}>
										<Stack spacing={1} flex={1}>
											<FormLabel htmlFor={"beschrijving"}>{t("forms.agreements.fields.type")}</FormLabel>
											<RadioButtonGroup isInline onChange={onChangeAfspraakType} defaultValue={AfspraakType.Expense} spacing={0}>
												<CustomRadioButton size={"sm"} roundedRight={0}
												                   value={AfspraakType.Expense}>{t("forms.agreements.fields.expenses")}</CustomRadioButton>
												<CustomRadioButton size={"sm"} roundedLeft={0} value={AfspraakType.Income}>{t("forms.agreements.fields.income")}</CustomRadioButton>
											</RadioButtonGroup>
										</Stack>
									</Stack>
									<Stack spacing={2} direction={isMobile ? "column" : "row"}>
										<Stack spacing={1} flex={1}>
											<FormLabel htmlFor={"description"}>{t("forms.agreements.fields.description")}</FormLabel>
											<Input isInvalid={isInvalid(description)} {...description.bind} id="description" />
										</Stack>
									</Stack>
									<Stack spacing={2} direction={isMobile ? "column" : "row"}>
										<Stack spacing={1} flex={1}>
											<FormLabel htmlFor={"organizationId"}>{t("forms.agreements.fields.organization")}</FormLabel>
											{orgsLoading ? (<Spinner />) : (<Select {...organizationId.bind} isInvalid={isInvalid(organizationId)} id="organizationId"
											                                        value={organizationId.value}>
												<option>{t("forms.agreements.fields.organizationChoose")}</option>
												{orgsData?.organisaties.map(o => (
													<option key={"o"+ o.id} value={o.id}>{o.weergaveNaam}</option>
												))}
												<option value={0}>{gebruikerData.gebruiker.voorletters} {gebruikerData.gebruiker.achternaam}</option>
											</Select>)}
										</Stack>
										<Stack spacing={1} flex={1}>
											<FormLabel htmlFor={"rekeningId"}>{t("forms.agreements.fields.bankAccount")}</FormLabel>
											<Select {...rekeningId.bind} isInvalid={isInvalid(rekeningId)} id="rekeningId" value={rekeningId.value}>
												<option>{t("forms.agreements.fields.bankAccountChoose")}</option>
												{parseInt(organizationId.value as unknown as string) === 0 ? (<>
													{gebruikerData.gebruiker.rekeningen.map(r => (
														<option key={r.id} value={r.id}>{r.rekeninghouder} ({r.iban})</option>
													))}
												</>) : (<>
													{orgsData?.organisaties.find(o => o.id === parseInt(organizationId.value as unknown as string))?.rekeningen.map(r => (
														<option key={r.id} value={r.id}>{r.rekeninghouder} ({r.iban})</option>
													))}
												</>)}
											</Select>
										</Stack>
									</Stack>
									<Stack spacing={2} direction={isMobile ? "column" : "row"}>
										<Stack spacing={1} flex={1}>
											<FormLabel htmlFor={"amount"}>{t("forms.agreements.fields.amount")}</FormLabel>
											<InputGroup maxWidth={"100%"} flex={1}>
												<InputLeftElement>&euro;</InputLeftElement>
												<Input isInvalid={isInvalid(amount)} {...amount.bind} id="amount" />
											</InputGroup>
										</Stack>
										<Stack spacing={1} flex={1}>
											<FormLabel htmlFor={"searchTerm"}>{t("forms.agreements.fields.searchTerm")}</FormLabel>
											<Input isInvalid={isInvalid(searchTerm)} {...searchTerm.bind} id="searchTerm" />
										</Stack>
									</Stack>
								</FormRight>
							</Stack>

							<Divider />

							<Stack spacing={2} direction={isMobile ? "column" : "row"}>
								<FormLeft>
									<Heading size={"md"}>{t("forms.agreements.sections.1.title")}</Heading>
									<FormHelperText id="personal-helperText">{t("forms.agreements.sections.1.helperText")}</FormHelperText>
								</FormLeft>
								<FormRight>

									<Stack spacing={2} direction={isMobile ? "column" : "row"}>
										<Stack spacing={1} flex={1}>
											<FormLabel htmlFor={"beschrijving"}>{t("forms.agreements.fields.isRecurring")}</FormLabel>
											<RadioButtonGroup isInline onChange={(val) => toggleRecurring(val === AfspraakPeriod.Periodic)}
											                  value={isRecurring ? AfspraakPeriod.Periodic : AfspraakPeriod.Once}
											                  defaultValue={"once"} spacing={0}>
												<CustomRadioButton size={"sm"} roundedRight={0}
												                   value={AfspraakPeriod.Once}>{t("forms.agreements.fields.isRecurring_once")}</CustomRadioButton>
												<CustomRadioButton size={"sm"} roundedLeft={0}
												                   value={AfspraakPeriod.Periodic}>{t("forms.agreements.fields.isRecurring_periodic")}</CustomRadioButton>
											</RadioButtonGroup>
										</Stack>
									</Stack>

									{isRecurring && (
										<Stack direction={isMobile ? "column" : "row"} spacing={1} mt={2}>
											<Stack spacing={1} flex={1}>
												<Stack direction={"row"} alignItems={"center"}>
													<FormLabel htmlFor={"interval"}>{t("interval.every")}</FormLabel>
													<Input type={"number"} min={1} {...intervalNumber.bind} width={100} id={"interval"} />
													<Select {...intervalType.bind} id="interval" value={intervalType.value}>
														<option value={"day"}>{t("interval.day", {count: parseInt(intervalNumber.value as unknown as string)})}</option>
														<option value={"week"}>{t("interval.week", {count: parseInt(intervalNumber.value as unknown as string)})}</option>
														<option value={"month"}>{t("interval.month", {count: parseInt(intervalNumber.value as unknown as string)})}</option>
														<option value={"year"}>{t("interval.year", {count: parseInt(intervalNumber.value as unknown as string)})}</option>
													</Select>
												</Stack>
											</Stack>
										</Stack>
									)}

									<Stack direction={isMobile ? "column" : "row"} spacing={1}>
										<Stack spacing={1} flex={1}>
											{isRecurring ? (
												<FormLabel htmlFor={"startDate.day"}>{t("forms.agreements.fields.startDate")}</FormLabel>
											) : (
												<FormLabel htmlFor={"startDate.day"}>{t("forms.common.fields.date")}</FormLabel>
											)}
											<Stack justifyContent={"flex-start"} direction={"row"} spacing={1} maxWidth={isMobile ? "100%" : 280} width={"100%"}>
												<Box flex={1}><Input isInvalid={isInvalid(startDate.day)} {...startDate.day.bind} id="startDate.day" /></Box>
												<Box flex={1}><Input isInvalid={isInvalid(startDate.month)} {...startDate.month.bind} id="startDate.month" /></Box>
												<Box flex={1}><Input isInvalid={isInvalid(startDate.year)} {...startDate.year.bind} id="startDate.year" /></Box>
											</Stack>
										</Stack>
									</Stack>

									{isRecurring && (
										<Stack direction={isMobile ? "column" : "row"} spacing={1} mt={2}>
											<Stack isInline={true} alignItems={"center"} spacing={3}>
												<Switch isChecked={isContinuous} onChange={() => toggleContinuous()} id={"isContinuous"} />
												<FormLabel htmlFor={"isContinuous"}>{t("forms.agreements.fields.continuous")}</FormLabel>
											</Stack>
										</Stack>
									)}

									{isRecurring && !isContinuous && (
										<Stack direction={isMobile ? "column" : "row"} spacing={1}>
											<Stack spacing={1} flex={1}>
												<FormLabel htmlFor={"nTimes"}>{t("forms.agreements.fields.nTimes")}</FormLabel>
												<Input type={"number"} {...nTimes.bind} width={100} id={"nTimes"} />
											</Stack>
										</Stack>
									)}
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
			);
		}
	}

	return (<>
		<BackButton to={Routes.Burger(burgerId)} />

		{renderPageContent()}
	</>);
};

const CustomRadioButton: React.FC<RadioProps> = React.forwardRef((props, ref) => {
	const {isChecked, isDisabled, value, children, ...rest} = props;
	return (
		<Button aria-checked={isChecked} ref={ref} variantColor={isChecked ? "primary" : "gray"} isDisabled={isDisabled} {...rest}>{children}</Button>
	);
});

export default CreateAgreement;