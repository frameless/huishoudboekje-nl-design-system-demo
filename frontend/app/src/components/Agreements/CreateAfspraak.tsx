import {Heading, Stack, useToast,} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {Gebruiker, useCreateAfspraakMutation, useGetOneGebruikerQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import BackButton from "../BackButton";
import AfspraakForm from "./AfspraakForm";

const CreateAfspraak = () => {
	const {burgerId} = useParams<{ burgerId: string }>();
	const {push} = useHistory();
	const {t} = useTranslation();
	const toast = useToast();

	const $gebruiker = useGetOneGebruikerQuery({
		variables: {
			id: parseInt(burgerId)
		}
	});

	const [createAfspraak, {loading}] = useCreateAfspraakMutation();

	const onSubmit = (data) => {
		createAfspraak({
			variables: {input: data}
		}).then(() => {
			toast({
				status: "success",
				title: t("messages.agreements.createSuccessMessage"),
				position: "top",
			});
			push(Routes.Burger(parseInt(burgerId)))
		}).catch(err => {
			console.error(err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				title: t("messages.genericError.title"),
				description: t("messages.genericError.description"),
			});
		});
	};

	return (<>
		<BackButton to={Routes.Burger(parseInt(burgerId))} />

		<Queryable query={$gebruiker} error={<Redirect to={Routes.NotFound} />}>{({gebruiker}: {gebruiker: Gebruiker}) => {
			if(!gebruiker){
				return null;
			}

			return (
				<Stack spacing={5}>
					<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
						<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
							<Heading size={"lg"}>{gebruiker.voornamen} {gebruiker.achternaam}</Heading>
						</Stack>
					</Stack>

					<AfspraakForm gebruiker={gebruiker} onSave={onSubmit} loading={loading} />
				</Stack>
			);
		}}</Queryable>
	</>);
};

export default CreateAfspraak;