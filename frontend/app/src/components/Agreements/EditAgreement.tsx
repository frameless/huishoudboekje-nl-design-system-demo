import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {GetAllOrganisatiesQuery, GetOneAfspraakQuery} from "../../services/graphql/queries";
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
	Select,
	Spinner,
	Stack,
	Switch,
	useToast
} from "@chakra-ui/core";
import {useInput, useIsMobile, useNumberInput, useToggle, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {useMutation, useQuery} from "@apollo/client";
import Queryable from "../../utils/Queryable";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import {AfspraakPeriod, AfspraakType, IAfspraak, IntervalType} from "../../models";
import {UpdateAfspraakMutation} from "../../services/graphql/mutations";
import Routes from "../../config/routes";
import CustomRadioButton from "./CustomRadioButton";
import {Interval} from "../../utils/things";
import BackButton from "../BackButton";

const EditAgreement = () => {
	const {id} = useParams<{ id }>();
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	const toast = useToast();
	const {push} = useHistory();

	const [isSubmitted, setSubmitted] = useState<boolean>(false);

	const $afspraak = useQuery<{ afspraak: IAfspraak }>(GetOneAfspraakQuery, {variables: {id}});
	const $organizations = useQuery(GetAllOrganisatiesQuery);
	const [updateAfspraak, {loading: updateLoading}] = useMutation(UpdateAfspraakMutation);

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
		defaultValue: IntervalType.Month,
		validate: [(v) => Object.keys(IntervalType).includes(v)]
	})
	const intervalNumber = useInput({
		defaultValue: "",
		validate: [v => !isNaN(parseInt(v))]
	});

	useEffect(() => {
		let mounted = true;

		if (mounted && $afspraak.data) {
			const {afspraak} = $afspraak.data;

			console.log(afspraak);

			if (afspraak) {
				setAfspraakType(afspraak.credit ? AfspraakType.Income : AfspraakType.Expense);
				description.setValue(afspraak.beschrijving);
				organizationId.setValue(afspraak.organisatie?.id || 0);
				if (afspraak.tegenRekening) {
					rekeningId.setValue(afspraak.tegenRekening.id);
				}
				amount.setValue(afspraak.bedrag);
				searchTerm.setValue(afspraak.kenmerk);
				const interval = Interval.parse(afspraak.interval);
				if (interval) {
					toggleRecurring(true);
					intervalType.setValue(IntervalType[interval.intervalType]);
					intervalNumber.setValue(interval.count.toString());
				}
				const startDatum = new Date(afspraak.startDatum);
				startDate.day.setValue(startDatum.getDate());
				startDate.month.setValue(startDatum.getMonth() + 1);
				startDate.year.setValue(startDatum.getFullYear());
				if (afspraak.nBetalingen) {
					toggleContinuous();
					nTimes.setValue(afspraak.nBetalingen);
				}
			}
		}

		return () => {
			mounted = false;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [$afspraak.data]);

	const onSubmit = () => {
		setSubmitted(true);

		updateAfspraak({
			variables: {
				id
			}
		}).then(result => {
			toast({
				status: "success",
				title: t("messages.agreements.createSuccessMessage"),
				position: "top",
			});

			if ($afspraak.data && $afspraak.data.afspraak.gebruiker.id) {
				push(Routes.Burger($afspraak.data.afspraak.gebruiker.id));
			}
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
	const onChangeAfspraakType = val => {
		if (val) {
			setAfspraakType(val);
		}
	};

	return (
		<Queryable query={$afspraak}>
			{(data) => {
				return (<>
					<BackButton to={Routes.Burger(data.afspraak.gebruiker.id)}  />

					<Stack spacing={5}>
						<Stack spacing={5}>
							<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
								<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
									<Heading size={"lg"}>{t("forms.agreements.titleEdit")}</Heading>
								</Stack>
							</Stack>
						</Stack>

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
													<CustomRadioButton size={"sm"} roundedLeft={0}
													                   value={AfspraakType.Income}>{t("forms.agreements.fields.income")}</CustomRadioButton>
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
												{$organizations.loading ? (<Spinner />) : (
													<Select {...organizationId.bind} isInvalid={isInvalid(organizationId)} id="organizationId" value={organizationId.value}>
														<option>{t("forms.agreements.fields.organizationChoose")}</option>
														{$organizations.data.organisaties.map(o => (
															<option key={"o" + o.id} value={o.id}>{o.weergaveNaam}</option>
														))}
														<option value={0}>{data.afspraak.gebruiker.voorletters} {data.afspraak.gebruiker.achternaam}</option>
													</Select>)}
											</Stack>
											<Stack spacing={1} flex={1}>
												<FormLabel htmlFor={"rekeningId"}>{t("forms.agreements.fields.bankAccount")}</FormLabel>
												<Select {...rekeningId.bind} isInvalid={isInvalid(rekeningId)} id="rekeningId" value={rekeningId.value}>
													<option>{t("forms.agreements.fields.bankAccountChoose")}</option>
													{parseInt(organizationId.value as unknown as string) === 0 ? (<>
														{data.afspraak.gebruiker.rekeningen.map(r => (
															<option key={r.id} value={r.id}>{r.rekeninghouder} ({r.iban})</option>
														))}
													</>) : (<Queryable loading={null} error={null} query={$organizations}>{(data) => (<>
														{data.organisaties.find(o => o.id === parseInt(organizationId.value as unknown as string))?.rekeningen.map(r => (
															<option key={r.id} value={r.id}>{r.rekeninghouder} ({r.iban})</option>
														))}
													</>)}
													</Queryable>)}
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
											<Button isLoading={updateLoading} type={"submit"} variantColor={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
										</Stack>
									</FormRight>
								</Stack>
							</Stack>
						</Box>
					</Stack>
				</>);
			}}
		</Queryable>
	);
};

export default EditAgreement;