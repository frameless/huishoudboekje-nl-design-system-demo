import {Box, Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftElement, Radio, RadioGroup, Stack} from "@chakra-ui/react";
import React, {useContext, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Afdeling, Organisatie, Rekening, Rubriek, UpdateAfspraakInput} from "../../generated/graphql";
import {currencyFormat, formatIBAN, useReactSelectStyles} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import AfspraakValidator from "../../validators/AfspraakValidator";
import {ReverseMultiLineOption, ReverseMultiLineValueContainer} from "../Layouts/ReactSelect/CustomComponents";
import AfspraakFormContext from "./EditAfspraak/context";

const bedragInputValidator = zod.string().regex(/^[^.]*$/);

type AfspraakFormProps = {
	burgerRekeningen: Rekening[],
	onChange: (values) => void,
	values?: UpdateAfspraakInput,
};

const AfspraakForm: React.FC<AfspraakFormProps> = ({values, burgerRekeningen, onChange}) => {
	const toast = useToaster();
	const {t} = useTranslation();
	const [data, setData] = useState(values || {} as UpdateAfspraakInput);
	const reactSelectStyles = useReactSelectStyles();
	const bedragRef = useRef<HTMLInputElement>(null);
	const [isAfspraakWithOrganisatie, setAfspraakWithOrganisatie] = useState<boolean>(false);
	const [selectedOrganisatie, setSelectedOrganisatie] = useState<Organisatie | undefined>(undefined);

	const {
		organisaties = [],
		rubrieken = [],
	} = useContext(AfspraakFormContext);

	const isValid = (fieldName: string) => AfspraakValidator.shape[fieldName]?.safeParse(data[fieldName]).success;
	const updateForm = (field: string, value: any) => {
		setData(prevData => ({
			...prevData,
			[field]: value,
		}));
	};

	const rubriekOptions = rubrieken.filter(r => r.grootboekrekening?.credit === data.credit).sort((a: Rubriek, b: Rubriek) => {
		return (a.naam && b.naam) && a.naam < b.naam ? -1 : 1;
	}).map((r: Rubriek) => ({
		key: r.id,
		value: r.id,
		label: r.naam,
	}));

	const tegenrekeningOptions = [
		...burgerRekeningen.map(r => ({
			key: `burger-${r.id}`,
			value: r.id,
			label: [formatIBAN(r.iban), r.rekeninghouder],
			context: {
				iban: formatIBAN(r.iban),
				rekeninghouder: r.rekeninghouder,
			},
		})),
		// @ts-ignore Todo: for some reason this throws an error, while this works perfectly fine. (31-03-2021)
		...organisaties.reduce((options, o: Organisatie) => {
			const afdelingen: Afdeling[] = o.afdelingen || [];

			const organisatieRekeningen: Rekening[] = afdelingen.reduce((allRekeningen: Rekening[], a) => {
				const afdelingRekeningen: Rekening[] = a.rekeningen || [];
				return [allRekeningen, ...afdelingRekeningen] as Rekening[];
			}, []);

			const rekeningen = organisatieRekeningen.map(r => ({
				key: r.id,
				value: r.id,
				label: [formatIBAN(r.iban), r.rekeninghouder],
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

	const components = {
		Option: ReverseMultiLineOption,
		ValueContainer: ReverseMultiLineValueContainer,
	};

	const genericSelectProps = {
		components,
	}

	const rekeningSelectProps = {
		styles: isValid("tegenRekeningId") ? reactSelectStyles.default : reactSelectStyles.error,
		components,
	};

	const organisatieOptions = organisaties.reduce((list: any[] = [], o: Organisatie) => { // Todo: fix list: any[]
		return [...list, {key: o.id, value: o.id, label: o.naam}];
	}, []);

	const onSubmit = () => {
		try {
			bedragInputValidator.parse(bedragRef.current?.value);
			const validatedData = AfspraakValidator.parse(data);
			onChange(validatedData);
		}
		catch (err) {
			toast({error: t("global.formError"), title: t("messages.genericError.title")});
		}
	};

	return (
		<Stack spacing={5}>

			<Stack direction={["column", "row"]}>
				<FormControl flex={1} isInvalid={!isValid("credit")} isRequired>
					<FormLabel>{t("afspraken.betaalrichting")}</FormLabel>
					<RadioGroup colorScheme={"primary"} onChange={e => {
						updateForm("credit", e === "inkomsten");
						updateForm("rubriekId", undefined);
					}} value={data.credit !== undefined ? (data.credit ? "inkomsten" : "uitgaven") : undefined}>
						<Stack>
							<Radio value="inkomsten">{t("afspraken.inkomsten")}</Radio>
							<Radio value="uitgaven">{t("afspraken.uitgaven")}</Radio>
						</Stack>
					</RadioGroup>
					<FormErrorMessage>{t("afspraakDetailView.invalidBetaalrichtingError")}</FormErrorMessage>
				</FormControl>
			</Stack>

			<Stack direction={["column", "row"]}>
				<FormControl flex={1} isRequired>
					<FormLabel>{t("afspraken.isAfspraakWithOrganisatie")}</FormLabel>
					<RadioGroup colorScheme={"primary"} onChange={result => {
						setAfspraakWithOrganisatie(result === "organisatie");
						updateForm("afdelingId", undefined);
						updateForm("tegenrekeningId", undefined);
					}} value={isAfspraakWithOrganisatie ? "organisatie" : "burger"}>
						<Stack>
							<Radio value="burger">{t("burger")}</Radio>
							<Radio value="organisatie">{t("organisatie")}</Radio>
						</Stack>
					</RadioGroup>
				</FormControl>
			</Stack>

			{isAfspraakWithOrganisatie && (<>
				<Stack direction={["column", "row"]}>
					<FormControl flex={1} isInvalid={selectedOrganisatie !== undefined} isRequired>
						<FormLabel>{t("organisatie")}</FormLabel>
						<Select id="organisatie" isClearable={true} noOptionsMessage={() => t("forms.afspraken.fields.organisatieChoose")} placeholder={t("select.placeholder")} maxMenuHeight={350}
							options={organisatieOptions} value={selectedOrganisatie ? organisatieOptions.find(o => o.value === selectedOrganisatie.id) : null}
							onChange={(result) => {
								const findOrganisatie = organisaties.find(o => o.id === result.value);
								setSelectedOrganisatie(findOrganisatie);
							}} {...genericSelectProps} />
						<FormErrorMessage>{t("afspraakDetailView.invalidOrganisatieError")}</FormErrorMessage>
					</FormControl>
				</Stack>

				<Stack direction={["column", "row"]}>
					<FormControl flex={1} isInvalid={!isValid("tegenRekeningId")} isRequired>
						<FormLabel>{t("afspraken.tegenrekening")}</FormLabel>
						<Select id="tegenrekening" isClearable={true} noOptionsMessage={() => t("forms.afspraken.fields.bankAccountChoose")} placeholder={t("select.placeholder")} maxMenuHeight={350}
							options={tegenrekeningOptions} value={data.tegenRekeningId ? tegenrekeningOptions.find(o => o.value === data.tegenRekeningId) : null}
							onChange={(result) => {
								updateForm("tegenRekeningId", result?.value);
								updateForm("afdelingId", result?.context.afdelingId);
							}} {...rekeningSelectProps} />
						<FormErrorMessage>{t("afspraakDetailView.invalidTegenrekeningError")}</FormErrorMessage>
					</FormControl>
				</Stack>
			</>)}

			<Stack direction={["column", "row"]}>
				<FormControl flex={1} isInvalid={!isValid("rubriekId")} isRequired>
					<FormLabel>{t("afspraken.rubriek")}</FormLabel>
					<Select id="rubriek" isClearable={true} noOptionsMessage={() => t("forms.afspraken.fields.rubriekChoose")} placeholder={t("select.placeholder")} maxMenuHeight={350}
						options={rubriekOptions} value={data.rubriekId ? rubriekOptions.find(r => r.value === data.rubriekId) : null}
						onChange={(result) => updateForm("rubriekId", result?.value)} styles={isValid("rubriekId") ? reactSelectStyles.default : reactSelectStyles.error} />
					<FormErrorMessage>{t("afspraakDetailView.invalidRubriekError")}</FormErrorMessage>
				</FormControl>

				<FormControl flex={1} isInvalid={!isValid("omschrijving")} isRequired={true}>
					<FormLabel>{t("afspraken.omschrijving")}</FormLabel>
					<Input value={data.omschrijving || ""} onChange={e => updateForm("omschrijving", e.target.value)} />
					<FormErrorMessage>{t("afspraakDetailView.invalidOmschrijvingError")}</FormErrorMessage>
				</FormControl>
			</Stack>

			<Stack direction={["column", "row"]}>
				<FormControl flex={1} isInvalid={!isValid("bedrag") || (bedragRef.current?.value ? !bedragInputValidator.safeParse(bedragRef.current?.value).success : false)} isRequired>
					<FormLabel>{t("afspraken.bedrag")}</FormLabel>
					<InputGroup>
						<InputLeftElement zIndex={0}>&euro;</InputLeftElement>
						<Input flex={3} ref={bedragRef} type={"text"} pattern={"^[^.]*$"} defaultValue={currencyFormat(data.bedrag || values?.bedrag || "").format() || ""} onChange={e => updateForm("bedrag", parseFloat(currencyFormat(e.target.value).toString()))} />
					</InputGroup>
					<FormErrorMessage>{t("afspraakDetailView.invalidBedragError")}</FormErrorMessage>
				</FormControl>
			</Stack>

			<Box>
				<Button colorScheme={"primary"} onClick={onSubmit}>{t("global.actions.save")}</Button>
			</Box>

		</Stack>
	);
};

export default AfspraakForm;