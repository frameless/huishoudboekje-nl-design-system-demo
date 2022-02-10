import {Divider, FormControl, FormLabel, Input, Stack, Table, Tbody, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import {useInput, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Configuratie as IConfiguratie, GetConfiguratieDocument, useCreateConfiguratieMutation, useGetConfiguratieQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import useToaster from "../../utils/useToaster";
import {FormLeft, FormRight} from "../Layouts/Forms";
import AddButton from "../shared/AddButton";
import ParameterItem from "./ParameterItem";

const Parameters = () => {
	const {t} = useTranslation();
	const $configuraties = useGetConfiguratieQuery();
	const [createConfiguratie] = useCreateConfiguratieMutation({
		refetchQueries: [
			{query: GetConfiguratieDocument},
		],
	});
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
		<Queryable query={$configuraties} children={data => {
			const configuraties = data.configuraties as IConfiguratie[];
			return (
				<Stack direction={["column", "row"]}>
					<FormLeft title={t("forms.configuratie.sections.title")} helperText={t("forms.configuratie.sections.helperText")} />
					<FormRight>
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
									<FormControl>
										<FormLabel>{t("forms.configuratie.fields.id")}</FormLabel>
										<Input {...key.bind} />
									</FormControl>
									<FormControl>
										<FormLabel>{t("forms.configuratie.fields.waarde")}</FormLabel>
										<Input {...value.bind} />
									</FormControl>
									<FormControl>
										<AddButton type={"submit"} />
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

export default Parameters;