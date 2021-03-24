import {Box, Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftElement, Radio, RadioGroup, Stack} from "@chakra-ui/react";
import React, {useContext, useState} from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import Routes from "../../../config/routes";
import {Afspraak, Rekening, Rubriek} from "../../../generated/graphql";
import {currencyFormat, useReactSelectStyles} from "../../../utils/things";
import useToaster from "../../../utils/useToaster";
import zod from "../../../utils/zod";
import BackButton from "../../BackButton";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";
import Page from "../../Layouts/Page";
import {RekeningOption, RekeningValueContainer} from "../../Layouts/ReactSelect/RekeningOption";
import Section from "../../Layouts/Section";
import AfspraakFormContext from "./context";
import {AfspraakBetalingValues} from "./index";

const validator = zod.object({
	rubriek: zod.number().nonnegative(),
	omschrijving: zod.string().nonempty(),
	tegenrekening: zod.number().nonnegative(),
	bedrag: zod.number().min(.01),
	credit: zod.boolean(),
});

type EditAfspraakFormProps = {
	afspraak: Afspraak,
	values: AfspraakBetalingValues,
	onChange: (values: AfspraakBetalingValues) => void,
};

const EditAfspraakForm: React.FC<EditAfspraakFormProps> = ({values, afspraak, onChange}) => {
	const toast = useToaster();
	const {t} = useTranslation();
	const [data, setData] = useState(values);

	const {organisaties, rubrieken} = useContext(AfspraakFormContext);
	const reactSelectStyles = useReactSelectStyles();

	const isValid = (fieldName: string) => validator.shape[fieldName]?.safeParse(data[fieldName]).success;
	const updateForm = (field: string, value: any) => {
		setData(prevData => ({
			...prevData,
			[field]: value,
		}));
	};

	const rubriekOptions = rubrieken.map((r: Rubriek) => ({
		key: r.id,
		value: r.id,
		label: r.naam,
	}));
	const burgerRekeningen: Rekening[] = afspraak.burger?.rekeningen || [];

	const tegenrekeningOptions = [
		...burgerRekeningen.map(r => ({
			key: `burger-${r.id}`,
			value: r.id,
			label: `${r.iban} (${r.rekeninghouder})`,
			context: {
				iban: r.iban,
				rekeninghouder: r.rekeninghouder,
			},
		})),
		...organisaties.reduce((options, o) => {
			const rekeningen = o.rekeningen.map(r => ({
				key: `${o.id}-${r.id}`,
				value: r.id,
				label: `${r.iban} (${r.rekeninghouder})`,
				context: {
					iban: r.iban,
					rekeninghouder: r.rekeninghouder,
				},
			}));
			return [
				...options,
				...rekeningen,
			];
		}, []),
	];

	const rekeningSelectProps = {
		styles: !isValid("tegenrekening") ? reactSelectStyles.error : reactSelectStyles.default,
		components: {
			Option: RekeningOption,
			ValueContainer: RekeningValueContainer,
		},
	};

	const onSubmit = () => {
		try {
			const validatedData = validator.parse(data);
			onChange(validatedData);
		}
		catch (err) {
			toast({error: err.message, title: t("messages.genericError.title")});
		}
	};

	return (
		<Page title={t("forms.agreements.titleEdit")} backButton={<BackButton to={Routes.ViewAfspraak(afspraak.id)} />}>
			<Section direction={["column", "row"]}>
				<FormLeft title={t("afspraakForm.section1.title")} helperText={t("afspraakForm.section1.helperText")} />
				<FormRight spacing={5}>

					<Stack direction={["column", "row"]}>
						<FormControl flex={1} isRequired>
							<FormLabel>{t("afspraak.betaalrichting")}</FormLabel>
							<RadioGroup onChange={e => updateForm("credit", e === "inkomsten")} value={data.credit ? "inkomsten" : "uitgaven"}>
								<Stack>
									<Radio value="inkomsten">{t("afspraak.inkomsten")}</Radio>
									<Radio value="uitgaven">{t("afspraak.uitgaven")}</Radio>
								</Stack>
							</RadioGroup>
						</FormControl>
					</Stack>

					<Stack direction={["column", "row"]}>
						<FormControl flex={1} isInvalid={!isValid("tegenrekening")} isRequired>
							<FormLabel>{t("afspraak.tegenrekening")}</FormLabel>
							<Select id="tegenrekening" isClearable={true} noOptionsMessage={() => t("forms.agreements.fields.bankAccountChoose")} maxMenuHeight={350}
								options={tegenrekeningOptions} value={data.tegenrekening ? tegenrekeningOptions.find(o => o.value === data.tegenrekening) : null}
								onChange={(result) => updateForm("tegenrekening", result?.value)} {...rekeningSelectProps} />
							<FormErrorMessage>{t("afspraakDetailView.invalidTegenrekeningError")}</FormErrorMessage>
						</FormControl>
					</Stack>

					<Stack direction={["column", "row"]}>
						<FormControl flex={1} isInvalid={!isValid("rubriek")} isRequired>
							<FormLabel>{t("afspraak.rubriek")}</FormLabel>
							<Select id="rubriek" isClearable={true} noOptionsMessage={() => t("forms.agreements.fields.rubriekChoose")} maxMenuHeight={350}
								options={rubriekOptions} value={data.rubriek ? rubriekOptions.find(r => r.value === data.rubriek) : null}
								onChange={(result) => updateForm("rubriek", result?.value)} styles={!data.rubriek ? reactSelectStyles.error : reactSelectStyles.default} />
							<FormErrorMessage>{t("afspraakDetailView.invalidRubriekError")}</FormErrorMessage>
						</FormControl>

						<FormControl flex={1} isInvalid={!isValid("omschrijving")} isRequired={true}>
							<FormLabel>{t("afspraak.omschrijving")}</FormLabel>
							<Input value={data.omschrijving || ""} onChange={e => updateForm("omschrijving", e.target.value)} />
							<FormErrorMessage>{t("afspraakDetailView.invalidOmschrijvingError")}</FormErrorMessage>
						</FormControl>
					</Stack>

					<Stack direction={["column", "row"]}>
						<FormControl flex={1} isInvalid={!isValid("bedrag")} isRequired>
							<FormLabel>{t("afspraak.bedrag")}</FormLabel>
							<InputGroup>
								<InputLeftElement zIndex={0}>&euro;</InputLeftElement>
								<Input flex={3} type={"text"} defaultValue={currencyFormat(data.bedrag).format() || ""} onChange={e => updateForm("bedrag", parseFloat(currencyFormat(e.target.value).toString()))} />
							</InputGroup>
							<FormErrorMessage>{t("afspraakDetailView.invalidBedragError")}</FormErrorMessage>
						</FormControl>
					</Stack>

					<Box>
						<Button colorScheme={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
					</Box>

				</FormRight>
			</Section>

			{/*<AfspraakForm afspraak={afspraak} loading={$updateAfspraak.loading} onSave={onSaveAfspraak} />*/}
		</Page>
	);
};

export default EditAfspraakForm;