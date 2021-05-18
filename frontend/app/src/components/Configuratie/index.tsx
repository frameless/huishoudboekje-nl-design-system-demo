import {Button, Divider, FormControl, FormLabel, Input, Stack} from "@chakra-ui/react";
import React from "react";
import {useInput, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Configuratie as IConfiguratie, useCreateConfiguratieMutation, useGetConfiguratieQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import useToaster from "../../utils/useToaster";
import {FormLeft, FormRight} from "../Layouts/Forms";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";
import ConfiguratieItem from "./ConfiguratieItem";

const Configuratie = () => {
	const {t} = useTranslation();
	const $configuraties = useGetConfiguratieQuery();
	const [createConfiguratie] = useCreateConfiguratieMutation();
	const toast = useToaster();

	const key = useInput({
		validate: [Validators.required],
	});
	const value = useInput({
		validate: [Validators.required],
	});

	const onSubmit = (e) => {
		e.preventDefault();

		if (!(key.isValid && value.isValid)) {
			toast({
				error: t("messages.genericError.description"),
			});
			return;
		}

		createConfiguratie({variables: {key: key.value, value: value.value}})
			.then(() => {
				$configuraties.refetch();
				key.reset();
				value.reset();
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
		<Page title={t("configuratie")}>

			<Section title={t("configuratie")}>
				<Stack direction={["column", "row"]}>
					<FormLeft title={t("forms.configuratie.sections.title")} helperText={t("forms.configuratie.sections.helperText")} />
					<FormRight>
						<Stack spacing={5}>
							<form onSubmit={onSubmit}>
								<Stack direction={["column", "row"]} alignItems={"flex-end"}>
									<FormControl>
										<FormLabel>{t("forms.configuratie.fields.id")}</FormLabel>
										<Input {...key.bind} />
									</FormControl>
									<FormControl>
										<FormLabel>{t("forms.configuratie.fields.waarde")}</FormLabel>
										<Input {...value.bind} />
									</FormControl>
									<FormControl>
										<Button type={"submit"} colorScheme={"primary"}>{t("actions.add")}</Button>
									</FormControl>
								</Stack>
							</form>

							<Divider />

							<Queryable query={$configuraties} children={data => {
								const configuraties = data.configuraties as IConfiguratie[];
								return (
									<Stack spacing={5}>
										{configuraties.map(c => (
											<ConfiguratieItem c={c} refetch={$configuraties.refetch} key={c.id} />
										))}
									</Stack>
								);
							}} />
						</Stack>
					</FormRight>
				</Stack>
			</Section>

		</Page>
	);
};

export default Configuratie;