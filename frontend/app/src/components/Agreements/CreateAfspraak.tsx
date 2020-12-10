import {Heading, Stack, useToast,} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {Gebruiker, useCreateAfspraakMutation, useGetOneBurgerQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import BackButton from "../BackButton";
import AfspraakForm from "./AfspraakForm";

const CreateAfspraak = () => {
	const {burgerId} = useParams<{ burgerId: string }>();
	const {push} = useHistory();
	const {t} = useTranslation();
	const toast = useToast();

	const $burger = useGetOneBurgerQuery({
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

		<Queryable query={$burger} error={<Redirect to={Routes.NotFound} />}>{({gebruiker: burger}: {gebruiker: Gebruiker}) => {
			if(!burger){
				return null;
			}

			return (
				<Stack spacing={5}>
					<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
						<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
							<Heading size={"lg"}>{burger.voornamen} {burger.achternaam}</Heading>
						</Stack>
					</Stack>

					<AfspraakForm burger={burger} onSave={onSubmit} loading={loading} />
				</Stack>
			);
		}}</Queryable>
	</>);
};

export default CreateAfspraak;