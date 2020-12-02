import {useMutation, useQuery} from "@apollo/client";
import {Heading, Stack, useToast,} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {IGebruiker} from "../../models";
import {CreateAfspraakMutation} from "../../services/graphql/mutations";
import {GetOneGebruikerQuery} from "../../services/graphql/queries";
import Queryable from "../../utils/Queryable";
import BackButton from "../BackButton";
import AfspraakForm from "./AfspraakForm";

const CreateAgreement = () => {
	const {burgerId} = useParams<{ burgerId }>();
	const {push} = useHistory();
	const {t} = useTranslation();
	const toast = useToast();

	const $gebruiker = useQuery<{ gebruiker: IGebruiker }>(GetOneGebruikerQuery, {
		variables: {
			id: burgerId
		}
	});

	const [createAfspraak, {loading}] = useMutation(CreateAfspraakMutation);

	const onSubmit = (data) => {
		createAfspraak({
			variables: {input: data}
		}).then(() => {
			toast({
				status: "success",
				title: t("messages.agreements.createSuccessMessage"),
				position: "top",
			});
			push(Routes.Burger(burgerId))
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
		<BackButton to={Routes.Burger(burgerId)} />

		<Queryable query={$gebruiker} error={<Redirect to={Routes.NotFound} />}>{(data) => (
			<Stack spacing={5}>
				<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
					<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
						<Heading size={"lg"}>{data.gebruiker.voornamen} {data.gebruiker.achternaam}</Heading>
					</Stack>
				</Stack>

				<AfspraakForm onSave={onSubmit} gebruiker={data.gebruiker} loading={loading} />
			</Stack>
		)}</Queryable>
	</>);
};

export default CreateAgreement;