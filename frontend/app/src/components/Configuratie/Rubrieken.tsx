import {Divider, FormControl, FormLabel, Input, Stack, Table, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {
	CreateRubriekMutationVariables,
	GetRubriekenConfiguratieDocument,
	Grootboekrekening,
	Rubriek,
	useCreateRubriekMutation,
	useGetRubriekenConfiguratieQuery,
} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {useReactSelectStyles} from "../../utils/things";
import useSelectProps from "../../utils/useSelectProps";
import useToaster from "../../utils/useToaster";
import {FormLeft, FormRight} from "../shared/Forms";
import AddButton from "../shared/AddButton";
import RubriekItem from "./RubriekItem";

const Rubrieken = () => {
	const toast = useToaster();
	const {t} = useTranslation();
	const [form, setForm] = useState<CreateRubriekMutationVariables>({});
	const $rubriekenConfiguratie = useGetRubriekenConfiguratieQuery();
	const reactSelectStyles = useReactSelectStyles();
	const selectProps = useSelectProps();
	const [createRubriek, {loading, called, reset}] = useCreateRubriekMutation({
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
			setForm(() => ({}));
			reset();
		});
	};

	return (
		<Queryable query={$rubriekenConfiguratie} children={data => {
			const grootboekrekeningen: Grootboekrekening[] = data.grootboekrekeningen || [];
			const rubrieken: Rubriek[] = data.rubrieken || [];

			const grootboekrekeningenOptions = selectProps.createSelectOptionsFromGrootboekrekeningen(grootboekrekeningen);

			return (
				<Stack direction={["column", "row"]}>
					<FormLeft title={t("forms.rubrieken.sections.title")} helperText={t("forms.rubrieken.sections.helperText")} />
					<FormRight>
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
										<Input onChange={v => setForm(f => ({
											...f,
											naam: v.target.value,
										}))} value={form.naam || ""} />
									</FormControl>
									<FormControl>
										<FormLabel>{t("forms.rubrieken.fields.grootboekrekening")}</FormLabel>
										<Select
											{...selectProps.defaultProps}
											components={selectProps.components.MultiLine}
											options={grootboekrekeningenOptions}
											styles={reactSelectStyles.default}
											onChange={(result) => {
												setForm(f => ({
													...f,
													grootboekrekening: result?.value,
												}));
											}}
											value={form.grootboekrekening ? grootboekrekeningenOptions.find(g => g.value === form.grootboekrekening) : null}
										/>
									</FormControl>
									<FormControl>
										<AddButton type={"submit"} isLoading={loading} isDisabled={called} />
									</FormControl>
								</Stack>
							</form>
						</Stack>
					</FormRight>
				</Stack>
			);
		}} />
	);
};

export default Rubrieken;