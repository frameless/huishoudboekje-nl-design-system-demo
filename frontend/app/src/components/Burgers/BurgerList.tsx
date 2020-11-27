import {useQuery} from "@apollo/client";
import {AddIcon, CloseIcon, SearchIcon} from "@chakra-ui/icons";
import {Button, Heading, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Spinner, Stack, useToast} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useInput} from "react-grapple";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {IGebruiker} from "../../models";
import {GetAllGebruikersQuery} from "../../services/graphql/queries";
import {searchFields} from "../../utils/things";
import DeadEndPage from "../DeadEndPage";
import BurgerListView from "./BurgerListView";

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
				<DeadEndPage message={t("messages.burgers.addHint", {buttonLabel: t("actions.add")})}>
					<Button size={"sm"} colorScheme={"primary"} variant={"solid"} leftIcon={<AddIcon />}
					        onClick={() => push(Routes.CreateBurger)}>{t("actions.add")}</Button>
				</DeadEndPage>
			);
		}

		if (filteredBurgers.length === 0) {
			return (
				<DeadEndPage message={t("messages.burgers.noSearchResults")}>
					<Button size="sm" colorScheme="primary" onClick={onClickResetSearch}>{t("actions.clearSearch")}</Button>
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
							<InputLeftElement><SearchIcon color={"gray.300"} /></InputLeftElement>
							<Input type={"text"} {...search.bind} onKeyDown={onKeyDownOnSearch} />
							{search.value.length > 0 && (
								<InputRightElement>
									<IconButton onClick={() => search.reset()} size={"xs"} variant={"link"} icon={<CloseIcon />} aria-label={""} color={"gray.300"} />
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