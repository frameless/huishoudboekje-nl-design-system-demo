import {Button, Divider, FormControl, FormErrorMessage, FormLabel, Input, Stack, Table, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Configuratie as IConfiguratie, GetConfiguratieDocument, useCreateConfiguratieMutation, useGetConfiguratieQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import useForm from "../../utils/useForm";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import useConfiguratieValidator from "../../validators/useConfiguratieValidator";
import Asterisk from "../shared/Asterisk";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import ParameterItem from "./ParameterItem";

const Parameters = () => {
	const validator = useConfiguratieValidator();
	const {t} = useTranslation();
	const $configuraties = useGetConfiguratieQuery();
	const [createConfiguratie, {loading}] = useCreateConfiguratieMutation({
		refetchQueries: [
			{query: GetConfiguratieDocument},
		],
	});
	const toast = useToaster();
	const [form, {updateForm, isFieldValid, reset, toggleSubmitted}] = useForm<zod.infer<typeof validator>>({
		validator,
	});

	const onSubmit = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		try {
			const data = validator.parse(form);
			createConfiguratie({
				variables: data,
			}).then(() => {
				reset();
				toast({
					success: t("messages.configuratie.createSuccess"),
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
			<Section title={t("forms.configuratie.sections.title")} helperText={t("forms.configuratie.sections.helperText")}>
				<Queryable query={$configuraties} children={data => {
					const configuraties: IConfiguratie[] = data.configuraties;
					return (
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

							<form onSubmit={onSubmit} noValidate={true}>
								<Stack direction={"column"} alignItems={"flex-end"}>
									<FormControl isInvalid={!isFieldValid("id")} isRequired={true}>
										<FormLabel>{t("forms.configuratie.fields.id")}</FormLabel>
										<Input
										 	autoComplete="no"
											aria-autocomplete="none"
											onChange={e => updateForm("id", e.target.value)}
											value={form.id || ""}
										/>
										<FormErrorMessage>{t("configuratieForm.emptyIdError")}</FormErrorMessage>
									</FormControl>
									<FormControl isInvalid={!isFieldValid("waarde")} isRequired={true}>
										<FormLabel>{t("forms.configuratie.fields.waarde")}</FormLabel>
										<Input
										 	autoComplete="no"
											aria-autocomplete="none"
											onChange={e => updateForm("waarde", e.target.value)}
											value={form.waarde || ""}
										/>
										<FormErrorMessage>{t("configuratieForm.emptyWaardeError")}</FormErrorMessage>
									</FormControl>
									<Button type={"submit"} colorScheme={"primary"} isLoading={loading}>{t("global.actions.save")}</Button>
									<Asterisk />
								</Stack>
							</form>
						</Stack>
					);
				}} />
			</Section>;
		</SectionContainer>
	);
};

export default Parameters;
