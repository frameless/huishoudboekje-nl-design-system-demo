import {Button, Divider, FormControl, FormLabel, Input, Stack, Table, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {GetRubriekenConfiguratieDocument, Grootboekrekening, Rubriek, useCreateRubriekMutation, useGetRubriekenConfiguratieQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {useReactSelectStyles} from "../../utils/things";
import useForm from "../../utils/useForm";
import useSelectProps from "../../utils/useSelectProps";
import useToaster from "../../utils/useToaster";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import RubriekItem from "./RubriekItem";

const Rubrieken = () => {
	const toast = useToaster();
	const {t} = useTranslation();
	const [form, {updateForm, reset}] = useForm({});
	const $rubriekenConfiguratie = useGetRubriekenConfiguratieQuery();
	const reactSelectStyles = useReactSelectStyles();
	const selectProps = useSelectProps();
	const [createRubriek, {loading}] = useCreateRubriekMutation({
		refetchQueries: [
			{query: GetRubriekenConfiguratieDocument},
		],
	});

	const onSubmit = (e) => {
		e.preventDefault();

		if (!form.naam || !form.grootboekrekening) {
			toast({
				error: t("messages.genericError.description"),
			});
			return;
		}

		createRubriek({
			variables: form,
		}).then(() => {
			toast({
				success: t("messages.rubrieken.createSuccess"),
			});
			reset();
		});
	};

	return (
		<Queryable query={$rubriekenConfiguratie} children={data => {
			const grootboekrekeningen: Grootboekrekening[] = data.grootboekrekeningen || [];
			const rubrieken: Rubriek[] = data.rubrieken || [];

			const grootboekrekeningenOptions = selectProps.createSelectOptionsFromGrootboekrekeningen(grootboekrekeningen);

			return (
				<SectionContainer>
					<Section title={t("forms.rubrieken.sections.title")} helperText={t("forms.rubrieken.sections.helperText")}>
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

							<form onSubmit={onSubmit}>
								<Stack direction={["column"]} alignItems={"flex-end"}>
									<FormControl>
										<FormLabel>{t("forms.rubrieken.fields.naam")}</FormLabel>
										<Input onChange={v => updateForm("naam", v.target.value)} value={form.naam || ""} />
									</FormControl>
									<FormControl>
										<FormLabel>{t("forms.rubrieken.fields.grootboekrekening")}</FormLabel>
										<Select
											{...selectProps.defaultProps}
											components={selectProps.components.MultiLine}
											options={grootboekrekeningenOptions}
											styles={reactSelectStyles.default}
											onChange={(result) => updateForm("grootboekrekening", result?.value)}
											value={form.grootboekrekening ? grootboekrekeningenOptions.find(g => g.value === form.grootboekrekening) : null}
										/>
									</FormControl>
									<Button type={"submit"} colorScheme={"primary"} isLoading={loading}>{t("global.actions.save")}</Button>
								</Stack>
							</form>
						</Stack>
					</Section>
				</SectionContainer>
			);
		}} />
	);
};

export default Rubrieken;