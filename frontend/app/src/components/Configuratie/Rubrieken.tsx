import {Button, Divider, FormControl, FormErrorMessage, FormLabel, Input, Stack, Table, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {GetRubriekenConfiguratieDocument, Grootboekrekening, Rubriek, useCreateRubriekMutation, useGetRubriekenConfiguratieQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {useReactSelectStyles} from "../../utils/things";
import useForm from "../../utils/useForm";
import useSelectProps from "../../utils/useSelectProps";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import useRubriekValidator from "../../validators/useRubriekValidator";
import Asterisk from "../shared/Asterisk";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import RubriekItem from "./RubriekItem";

const Rubrieken = () => {
	const validator = useRubriekValidator();
	const toast = useToaster();
	const {t} = useTranslation();
	const $rubriekenConfiguratie = useGetRubriekenConfiguratieQuery();
	const reactSelectStyles = useReactSelectStyles();
	const selectProps = useSelectProps();
	const [createRubriek, {loading}] = useCreateRubriekMutation({
		refetchQueries: [
			{query: GetRubriekenConfiguratieDocument},
		],
	});
	const [form, {updateForm, isFieldValid, reset, toggleSubmitted}] = useForm<zod.infer<typeof validator>>({
		validator,
	});

	const onSubmit = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		try {
			const data = validator.parse(form);
			createRubriek({
				variables: {
					naam: data.naam,
					grootboekrekening: data.grootboekrekening,
				},
			}).then(() => {
				reset();
				toast({
					success: t("messages.rubrieken.createSuccess"),
				});
			}).catch(err => {
				let message = err.message;
				if (err.message.includes("already exists")) {
					message = t("messages.configuratie.alreadyExists");
				}

				toast({
					error: message,
				});
			});
		}
		catch (err) {
			toast({
				error: t("messages.genericError.description"),
			});
		}
	};

	return (
		<SectionContainer>
			<Section title={t("forms.rubrieken.sections.title")} helperText={t("forms.rubrieken.sections.helperText")}>
				<Queryable query={$rubriekenConfiguratie} children={data => {
					const grootboekrekeningen: Grootboekrekening[] = data.grootboekrekeningen || [];
					const rubrieken: Rubriek[] = data.rubrieken || [];

					const grootboekrekeningenOptions = selectProps.createSelectOptionsFromGrootboekrekeningen(grootboekrekeningen);

					return (
						<Stack spacing={5} divider={<Divider />}>
							{rubrieken.length > 0 && (
								<Table size={"sm"} variant={"noLeftPadding"}>
									<Thead>
										<Tr>
											<Th>{t("forms.rubrieken.fields.grootboekrekening")}</Th>
											<Th>{t("forms.rubrieken.fields.naam")}</Th>
											<Th w={100} />
										</Tr>
									</Thead>
									<Tbody>
										{rubrieken.map((r) => (
											<RubriekItem rubriek={r} key={r.id} />
										))}
									</Tbody>
								</Table>
							)}

							<form onSubmit={onSubmit} noValidate={true}>
								<Stack direction={["column"]} alignItems={"flex-end"}>
									<FormControl isInvalid={!isFieldValid("naam")} isRequired={true}>
										<FormLabel>{t("forms.rubrieken.fields.naam")}</FormLabel>
										<Input
										 	autoComplete="no"
											aria-autocomplete="none"
											onChange={v => updateForm("naam", v.target.value)}
											value={form.naam || ""}
										/>
										<FormErrorMessage>{t("configuratieForm.emptyNameErroror")}</FormErrorMessage>
									</FormControl>
									<FormControl isInvalid={!isFieldValid("grootboekrekening")} isRequired={true}>
										<FormLabel>{t("forms.rubrieken.fields.grootboekrekening")}</FormLabel>
										<Select
											{...selectProps.defaultProps}
											components={selectProps.components.MultiLine}
											options={grootboekrekeningenOptions}
											styles={reactSelectStyles.default}
											onChange={(result) => updateForm("grootboekrekening", result?.value)}
											value={form.grootboekrekening ? grootboekrekeningenOptions.find(g => g.value === form.grootboekrekening) : null}
										/>
										<FormErrorMessage>{t("configuratieForm.emptyGrootboekrekeningError")}</FormErrorMessage>
									</FormControl>
									<Button type={"submit"} colorScheme={"primary"} isLoading={loading}>{t("global.actions.save")}</Button>
									<Asterisk />
								</Stack>
							</form>
						</Stack>
					);
				}} />
			</Section>
		</SectionContainer>
	);
};

export default Rubrieken;
