import {useToast} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {Afspraak, useGetOneAfspraakQuery, useUpdateAfspraakMutation} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import BackButton from "../BackButton";
import Page from "../Layouts/Page";
import AfspraakForm from "./AfspraakForm";

const EditAgreement = () => {
	const {id} = useParams<{ id: string }>();
	const {t} = useTranslation();
	const toast = useToast();
	const {push} = useHistory();

	const $afspraak = useGetOneAfspraakQuery({
		variables: {
			id: parseInt(id)
		}
	});
	const [updateAfspraak, $updateAfspraak] = useUpdateAfspraakMutation();

	const onSaveAfspraak = (data) => {
		updateAfspraak({
			variables: {
				id: parseInt(id),
				input: data
			}
		}).then(() => {
			toast({
				status: "success",
				title: t("messages.agreements.editSuccessMessage"),
				position: "top",
			});

			if ($afspraak.data?.afspraak?.gebruiker?.id) {
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
		<Queryable query={$afspraak}>{({afspraak}: { afspraak: Afspraak }) => {
			return (
				<Page title={t("forms.agreements.titleEdit")} backButton={<BackButton to={Routes.Burger(afspraak.gebruiker?.id)} />}>
					<AfspraakForm afspraak={afspraak} loading={$updateAfspraak.loading} onSave={onSaveAfspraak} />
				</Page>
			);
		}}</Queryable>
	);
};

export default EditAgreement;