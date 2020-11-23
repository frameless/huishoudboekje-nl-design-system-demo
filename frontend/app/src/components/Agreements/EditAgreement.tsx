import React from "react";
import {useHistory, useParams} from "react-router-dom";
import {GetOneAfspraakQuery} from "../../services/graphql/queries";
import {Heading, Stack, useToast} from "@chakra-ui/core";
import {useTranslation} from "react-i18next";
import {useMutation, useQuery} from "@apollo/client";
import Queryable from "../../utils/Queryable";
import {IAfspraak} from "../../models";
import {UpdateAfspraakMutation} from "../../services/graphql/mutations";
import Routes from "../../config/routes";
import BackButton from "../BackButton";
import AfspraakForm from "./AfspraakForm";

const EditAgreement = () => {
	const {id} = useParams<{ id }>();
	const {t} = useTranslation();
	const toast = useToast();
	const {push} = useHistory();

	const $afspraak = useQuery<{ afspraak: IAfspraak }>(GetOneAfspraakQuery, {variables: {id}});
	const [updateAfspraak, {loading: updateLoading}] = useMutation(UpdateAfspraakMutation);

	const onSaveAfspraak = (data) => {
		updateAfspraak({
			variables: {
				id,
				...data
			}
		}).then(result => {
			toast({
				status: "success",
				title: t("messages.agreements.editSuccessMessage"),
				position: "top",
			});

			if ($afspraak.data && $afspraak.data.afspraak.gebruiker.id) {
				push(Routes.Burger($afspraak.data.afspraak.gebruiker.id));
			}
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

	return (
		<Queryable query={$afspraak}>
			{(data) => {
				return (
					<>
						<BackButton to={Routes.Burger(data.afspraak.gebruiker.id)} />

						<Stack spacing={5}>
							<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
								<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
									<Heading size={"lg"}>{t("forms.agreements.titleEdit")}</Heading>
								</Stack>
							</Stack>

							<AfspraakForm gebruiker={data.afspraak.gebruiker} afspraak={data.afspraak} loading={updateLoading} onSave={onSaveAfspraak} />
						</Stack>
					</>
				);
			}}
		</Queryable>
	);
};

export default EditAgreement;