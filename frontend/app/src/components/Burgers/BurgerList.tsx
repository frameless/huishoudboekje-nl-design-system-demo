import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useQuery} from "@apollo/client";
import {searchFields} from "../../utils/things";
import {Button, Heading, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Spinner, Stack, useToast} from "@chakra-ui/core";
import {IGebruiker} from "../../models";
import {GetAllGebruikersQuery} from "../../services/graphql/queries";
import BurgerListView from "./BurgerListView";
import {useInput} from "react-grapple";
import DeadEndPage from "../DeadEndPage";
import Routes from "../../config/routes";
import {useHistory} from "react-router-dom";

const BurgerList = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const toast = useToast();
	const search = useInput<string>({
		placeholder: t("forms.search.fields.search")
	});
	const {data, loading, error} = useQuery<{ gebruikers: IGebruiker[] }>(GetAllGebruikersQuery, {
		// This forces a refetch when we're routed back to this page after a mutation.
		fetchPolicy: "no-cache"
	});
	const [filteredBurgers, setFilteredBurgers] = useState<IGebruiker[]>([]);

	useEffect(() => {
		if (data) {
			if (data.gebruikers) {
				setFilteredBurgers(data.gebruikers);
			}
		}
	}, [data, error, t, toast])

	useEffect(() => {
		let mounted = true;

		if (mounted && data && data.gebruikers) {
			setFilteredBurgers(data.gebruikers.filter(b => searchFields(search.value, [b.achternaam || "", b.voornamen || ""])));
		}

		return () => {
			mounted = false
		};
	}, [data, search.value]);

	useEffect(() => {
		if (error) {
			console.error(error);
		}
	}, [error]);

	const onKeyDownOnSearch = (e) => {
		if (e.key === "Escape") {
			search.reset();
		}
	};

	const showSearch = (!loading && data && !error && data.gebruikers.length > 0);
	const onClickResetSearch = () => {
		search.reset();
		search.ref.current!.focus();
	};

	const renderPageContent = () => {
		if (loading) {
			return (
				<DeadEndPage illustration={false} bg={"transparent"}>
					<Spinner />
				</DeadEndPage>
			);
		}

		if (error) {
			return (<DeadEndPage message={t("messages.genericError.description")} />);
		}

		if (data?.gebruikers.length === 0) {
			return (
				<DeadEndPage message={t("messages.burgers.addHint", {buttonLabel: t("buttons.burgers.createNew")})}>
					<Button size={"sm"} variantColor={"primary"} variant={"solid"} leftIcon={"add"}
					        onClick={() => push(Routes.CreateBurger)}>{t("buttons.burgers.createNew")}</Button>
				</DeadEndPage>
			);
		}

		if (filteredBurgers.length === 0) {
			return (
				<DeadEndPage message={t("messages.burgers.noSearchResults")}>
					<Button size="sm" variantColor="primary" onClick={onClickResetSearch}>{t("actions.clearSearch")}</Button>
				</DeadEndPage>
			);
		}

		return (<BurgerListView burgers={filteredBurgers} showAddButton={search.value.trim().length === 0} />);
	};

	return (
		<Stack spacing={5}>
			<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
				<Stack direction={"row"} spacing={5} alignItems={"center"}>
					<Heading size={"lg"}>{t("burgers.burgers")}</Heading>
				</Stack>
				{showSearch && (
					<Stack direction={"row"} spacing={5}>
						<InputGroup>
							<InputLeftElement><Icon name="search" color={"gray.300"} /></InputLeftElement>
							<Input type={"text"} {...search.bind} onKeyDown={onKeyDownOnSearch} />
							{search.value.length > 0 && (
								<InputRightElement>
									<IconButton onClick={() => search.reset()} size={"xs"} variant={"link"} icon={"close"} aria-label={""} color={"gray.300"} />
								</InputRightElement>
							)}
						</InputGroup>
					</Stack>
				)}
			</Stack>

			{renderPageContent()}
		</Stack>
	)
};

export default BurgerList;