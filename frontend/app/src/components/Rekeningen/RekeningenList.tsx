import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {BoxProps, Button, FormLabel, Heading, Input, Stack, Stat, StatGroup, StatHelpText, StatLabel, StatNumber,} from "@chakra-ui/core";
import {electronicFormatIBAN, extractIBAN, friendlyFormatIBAN} from "ibantools";

import {IRekening} from "../../models";
import {FormLeft, FormRight, Label} from "../Forms/FormLeftRight";
import {useInput, useIsMobile, Validators} from "react-grapple";
import DeadEndPage from "../DeadEndPage";

const RekeningEdit = ({rekening, onSave}: { rekening: IRekening, onSave: (rekening: IRekening) => void }) => {
	const {t} = useTranslation();
	const rekeninghouder = useInput({
		defaultValue: rekening.rekeninghouder || "",
		validate: [Validators.required],
	});
	const iban = useInput({
		defaultValue: rekening.iban || "",
		validate: [Validators.required, (v) => {
			const iban = extractIBAN(electronicFormatIBAN(v));
			return iban.valid && iban.countryCode === "NL";
		}],
		placeholder: friendlyFormatIBAN("NL00BANK0123456789"),
	});
	const isInvalid = (input) => input.dirty && !input.isValid;

	const onSubmit = (e) => {
		onSave({...rekening, rekeninghouder: rekeninghouder.value, iban: iban.value});
	};

	return (
		<Stat>
			<StatLabel>
				<Stack spacing={1} flex={2}>
					<FormLabel htmlFor={"rekeninghouder"}>{t("forms.rekeningen.fields.accountHolder")}</FormLabel>
					<Input isInvalid={isInvalid(rekeninghouder)} {...rekeninghouder.bind} id="rekeninghouder" />
				</Stack>
			</StatLabel>
			<StatNumber>
				<Stack spacing={1} flex={2}>
					<FormLabel htmlFor={"iban"}>{t("forms.rekeningen.fields.iban")}</FormLabel>
					<Input isInvalid={isInvalid(iban)} {...iban.bind} id="iban" />
				</Stack>
			</StatNumber>
			<StatHelpText>
				<Button type={"submit"} variantColor={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
			</StatHelpText>
		</Stat>
	);
};

const RekeningenList: React.FC<BoxProps & { rekeningen: IRekening[], onChange: (rekeningen: IRekening[]) => void, defaultRekeninghouder?: string }> = ({rekeningen, onChange, defaultRekeninghouder, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useIsMobile();
	const [newRekening, setNewRekening] = useState<IRekening>();
	const onClickAddRekening = (e) => {
		setNewRekening({rekeninghouder: defaultRekeninghouder} as IRekening);
	};

	const onSaveNew = (rekening: IRekening) => {
		onChange([...rekeningen, rekening]);
		setNewRekening(undefined);
	};
	const noRekeningenFound = rekeningen.length === 0 && !newRekening;
	return (
		<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"} {...props}>
			<FormLeft>
				<Heading display={"box"} size={"md"}>{t("forms.burgers.sections.rekeningen.title")}</Heading>
				<Label>{t("forms.burgers.sections.rekeningen.detailText")}</Label>
			</FormLeft>
			<FormRight width={"100%"}>
				{noRekeningenFound && (
					<DeadEndPage message={t("messages.rekeningen.addHint", {buttonLabel: t("actions.add")})}>
						<Button variantColor={"primary"} onClick={onClickAddRekening}>{t("buttons.common.createNew")}</Button>
					</DeadEndPage>
				)}

				{!noRekeningenFound && <>
					<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
						<FormLeft />
						<FormRight>
							<Stack direction={"row"} spacing={5} justifyContent={"flex-end"}>
								<Button variantColor={"primary"} isDisabled={!!newRekening}
									onClick={onClickAddRekening}>{t("actions.add")}</Button>
							</Stack>
						</FormRight>
					</Stack>
					<StatGroup>
						{rekeningen.map((rekening, i) =>
							<Stat key={i}>
								<StatLabel>{rekening.rekeninghouder}</StatLabel>
								<StatNumber>{friendlyFormatIBAN(rekening.iban)}</StatNumber>
							</Stat>,
						)}
						{newRekening && <RekeningEdit rekening={newRekening} onSave={onSaveNew} />}
					</StatGroup>
				</>}
			</FormRight>
		</Stack>
	);
};

export default RekeningenList;