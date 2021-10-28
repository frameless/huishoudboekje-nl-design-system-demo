import {Box, Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftElement, Radio, RadioGroup, Stack} from "@chakra-ui/react";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Organisatie, Rekening, UpdateAfspraakInput} from "../../generated/graphql";
import {currencyFormat, useReactSelectStyles} from "../../utils/things";
import useSelectProps from "../../utils/useSelectProps";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import AfspraakValidator from "../../validators/AfspraakValidator";
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
	const [data, setData] = useState<UpdateAfspraakInput>(values || {} as UpdateAfspraakInput);
	const reactSelectStyles = useReactSelectStyles();
	const bedragRef = useRef<HTMLInputElement>(null);
	const [isAfspraakWithOrganisatie, setAfspraakWithOrganisatie] = useState<boolean>(false);
	const [selectedOrganisatie, setSelectedOrganisatie] = useState<Organisatie | undefined>(undefined);
	const {
		defaultProps,
		components,
		createSelectOptionsFromRekeningen,
		createSelectOptionsFromRubrieken,
		createSelectOptionsFromOrganisaties,
		createSelectOptionsFromAfdelingen,
		createSelectOptionsFromPostadressen,
	} = useSelectProps();
	const isValid = (fieldName: string) => AfspraakValidator.shape[fieldName]?.safeParse(data[fieldName]).success;

	const {
		organisaties = [],
		rubrieken = [],
	} = useContext(AfspraakFormContext);
	const afdelingen = selectedOrganisatie?.afdelingen || [];
	const rekeningen = afdelingen.find(a => a.id === data.afdelingId)?.rekeningen || [];
	const postadressen = afdelingen.find(a => a.id === data.afdelingId)?.postadressen || [];

	useEffect(() => {
		setSelectedOrganisatie(organisaties.find(o => o.afdelingen?.find(a => values?.afdelingId === a.id)));
		setAfspraakWithOrganisatie(!!values?.afdelingId);
	}, [values, organisaties]);

	const updateForm = (field: string, value: any) => {
		setData(prevData => ({
			...prevData,
			[field]: value,
		}));
	};

	const rubriekOptions = createSelectOptionsFromRubrieken(rubrieken.filter(r => r.grootboekrekening?.credit === data.credit));
	const organisatieOptions = createSelectOptionsFromOrganisaties(organisaties);
	const afdelingOptions = createSelectOptionsFromAfdelingen(afdelingen);
	const rekeningOptions = createSelectOptionsFromRekeningen(isAfspraakWithOrganisatie ? rekeningen : burgerRekeningen);
	const postadresOptions = createSelectOptionsFromPostadressen(postadressen);

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

	useEffect(() => {
		// If the selected organisatie has only one afdeling, preselect it, otherwise, leave the option open.
		updateForm("afspraakId", selectedOrganisatie?.afdelingen?.length === 1 ? selectedOrganisatie.afdelingen[0] : undefined);
	}, [selectedOrganisatie]);

	useEffect(() => {
		const selectedAfdeling = afdelingen.find(a => a.id === data.afdelingId);

		// If the selected organisatie has only one afdeling, preselect it, otherwise, leave the option open.
		if (!data.tegenRekeningId) {
			updateForm("tegenRekeningId", selectedAfdeling?.rekeningen?.length === 1 ? selectedAfdeling.rekeningen[0]?.id : undefined);
		}

		// If the selected organisatie has only one postadres, preselect it, otherwise, leave the option open.
		if (!data.postadresId) {
			updateForm("postadresId", selectedAfdeling?.postadressen?.length === 1 ? selectedAfdeling.postadressen[0]?.id : undefined);
		}
	}, [afdelingen, data.tegenRekeningId, data.postadresId, data.afdelingId]);

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
						setSelectedOrganisatie(undefined);
						updateForm("afdelingId", undefined);
						updateForm("tegenRekeningId", undefined);
						updateForm("postadresId", undefined);
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
					<FormControl flex={1} isInvalid={!selectedOrganisatie} isRequired>
						<FormLabel>{t("organisatie")}</FormLabel>
						<Select {...defaultProps} id="organisatie" options={organisatieOptions}
							value={selectedOrganisatie ? organisatieOptions.find(o => o.value === selectedOrganisatie.id) : null}
							onChange={(result) => {
								const findOrganisatie = organisaties.find(o => o.id === result?.value);
								setSelectedOrganisatie(findOrganisatie);
							}} />
						<FormErrorMessage>{t("forms.afspraak.invalidOrganisatieError")}</FormErrorMessage>
					</FormControl>
				</Stack>

				<Stack direction={["column", "row"]}>
					<FormControl flex={1} isInvalid={!isValid("afdelingId")} isRequired>
						<FormLabel>{t("afdeling")}</FormLabel>
						<Select {...defaultProps} id="afdeling" noOptionsMessage={() => t("forms.afspraken.select.noAfdelingenOptionsMessage")} options={afdelingOptions}
							value={data.afdelingId ? afdelingOptions.find(o => o.value === data.afdelingId) : null}
							onChange={(result) => {
								const findAfdeling = afdelingen.find(o => o.id === result?.value);
								updateForm("afdelingId", findAfdeling?.id);
							}} />
						<FormErrorMessage>{t("forms.afspraak.invalidAfdelingError")}</FormErrorMessage>
					</FormControl>
				</Stack>

				<Stack direction={["column", "row"]}>
					<FormControl flex={1} isInvalid={!isValid("postadresId")} isRequired>
						<FormLabel>{t("postadres")}</FormLabel>
						<Select {...defaultProps} id="postadres" noOptionsMessage={() => t("forms.afspraken.select.noPostadressenOptionsMessage")} options={postadresOptions}
							value={data.postadresId ? postadresOptions.find(o => o.value === data.postadresId) : null}
							onChange={(result) => {
								const findPostadres = postadressen.find(o => o.id === result?.value);
								updateForm("postadresId", findPostadres?.id);
							}} />
						<FormErrorMessage>{t("forms.afspraak.invalidPostadresError")}</FormErrorMessage>
					</FormControl>
				</Stack>
			</>)}

			<Stack direction={["column", "row"]}>
				<FormControl flex={1} isInvalid={!isValid("tegenRekeningId")} isRequired>
					<FormLabel>{t("afspraken.tegenrekening")}</FormLabel>
					<Select {...defaultProps} id="tegenrekening" components={components.ReverseMultiLine} noOptionsMessage={() => t("forms.afspraken.select.noRekeningenOptionsMessage")} options={rekeningOptions}
						value={data.tegenRekeningId ? rekeningOptions.find(o => o.value === data.tegenRekeningId) : null}
						onChange={(result) => {
							updateForm("tegenRekeningId", result?.value);
						}} styles={isValid("tegenRekeningId") ? reactSelectStyles.default : reactSelectStyles.error} />
					<FormErrorMessage>{t("forms.afspraak.invalidRekeningError")}</FormErrorMessage>
				</FormControl>
			</Stack>

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