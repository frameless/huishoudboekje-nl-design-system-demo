import {useToast} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {Burger, useCreateAfspraakMutation, useGetOneBurgerQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {formatBurgerName} from "../../utils/things";
import BackButton from "../BackButton";
import Page from "../Layouts/Page";
import AfspraakForm from "./AfspraakForm";

const CreateAfspraak = () => {
	const {burgerId} = useParams<{burgerId: string}>();
	const {push} = useHistory();
	const {t} = useTranslation();
	const toast = useToast();

	const $burger = useGetOneBurgerQuery({
		variables: {
			id: parseInt(burgerId),
		},
	});

	const [createAfspraak, {loading}] = useCreateAfspraakMutation();

	const onSubmit = (data) => {
		createAfspraak({
			variables: {input: data},
		}).then(() => {
			toast({
				status: "success",
				title: t("messages.agreements.createSuccessMessage"),
				position: "top",
				isClosable: true,
			});
			push(Routes.Burger(parseInt(burgerId)));
		}).catch(err => {
			console.error(err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				title: t("messages.genericError.title"),
				description: t("messages.genericError.description"),
				isClosable: true,
			});
		});
	};

	return (
		<Queryable query={$burger} error={<Redirect to={Routes.NotFound} />}>{(data) => {
			const burger: Burger = data.burger;

			if (!burger) {
				return null;
			}

			return (
				<Page title={formatBurgerName(burger)} backButton={<BackButton to={Routes.Burger(parseInt(burgerId))} />}>
					<AfspraakForm burger={burger} onSave={onSubmit} loading={loading} />
				</Page>
			);
		}}</Queryable>
	);
};

export default CreateAfspraak;