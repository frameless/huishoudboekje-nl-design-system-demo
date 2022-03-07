import {Button, Divider, FormControl, FormErrorMessage, FormLabel, Input, Stack, Table, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Configuratie as IConfiguratie, GetConfiguratieDocument, useCreateConfiguratieMutation, useGetConfiguratieQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import useForm from "../../utils/useForm";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import ParameterItem from "./ParameterItem";

const validator = zod.object({
	key: zod.string().nonempty(),
	value: zod.string().nonempty(),
});

const Parameters = () => {
	const {t} = useTranslation();
	const $configuraties = useGetConfiguratieQuery();
	const [createConfiguratie, {loading}] = useCreateConfiguratieMutation({
		refetchQueries: [
			{query: GetConfiguratieDocument},
		],
	});
	const toast = useToaster();
	const [form, {updateForm, isValid, isFieldValid, reset, toggleSubmitted}] = useForm({
		validator,
	});

	const onSubmit = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		if (!isValid()) {
			toast({
				error: t("messages.genericError.description"),
			});
			return;
		}

		createConfiguratie({
			variables: {
				key: form.key!,
				value: form.value!,
			},
		})
			.then(() => {
				reset();
				toast({
					success: t("messages.configuratie.createSuccess"),
				});
			})
			.catch(err => {
				let message = err.message;
				if (err.message.includes("already exists")) {
					message = t("messages.configuratie.alreadyExists");
				}

				toast({
					error: message,
				});
			});
	};

	return (
		<Queryable query={$configuraties} children={data => {
			const configuraties = data.configuraties as IConfiguratie[];
			return (
				<SectionContainer>
					<Section title={t("forms.configuratie.sections.title")} helperText={t("forms.configuratie.sections.helperText")}>
						<Stack spacing={5} divider={<Divider />}>
							{configuraties.length > 0 && (
								<Table size={"sm"} variant={"noLeftPadding"}>
									<Thead>
										<Tr>
											<Th>{t("forms.configuratie.fields.id")}</Th>
											<Th>{t("forms.configuratie.fields.waarde")}</Th>
											<Th w={100} />
										</Tr>
									</Thead>
									<Tbody>
										{configuraties.map(c => (
											<ParameterItem c={c} key={c.id} />
										))}
									</Tbody>
								</Table>
							)}

							<form onSubmit={onSubmit}>
								<Stack direction={"column"} alignItems={"flex-end"}>
									<FormControl isInvalid={!isFieldValid("key")}>
										<FormLabel>{t("forms.configuratie.fields.id")}</FormLabel>
										<Input onChange={e => updateForm("key", e.target.value)} value={form.key || ""} />
										<FormErrorMessage>{t("configuratieForm.emptyKeyError")}</FormErrorMessage>
									</FormControl>
									<FormControl isInvalid={!isFieldValid("value")}>
										<FormLabel>{t("forms.configuratie.fields.waarde")}</FormLabel>
										<Input onChange={e => updateForm("value", e.target.value)} value={form.value || ""} />
										<FormErrorMessage>{t("configuratieForm.emptyValueError")}</FormErrorMessage>
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

export default Parameters;