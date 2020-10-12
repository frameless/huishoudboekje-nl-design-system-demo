import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useInput} from "react-grapple";
import {useHistory} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {searchFields} from "../../utils/things";
import {Box, Button, Heading, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, SimpleGrid, Spinner, Stack, Text, useToast} from "@chakra-ui/core";
import Routes from "../../config/routes";
import {ReactComponent as Empty} from "../../assets/images/illustration-empty.svg";
import GebruikerCard from "./GebruikerCard";
import {IGebruiker} from "../../models";
import {GetAllGebruikersQuery} from "../../services/graphql/queries";

const CitizenList = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const toast = useToast();
	const search = useInput<string>({
		placeholder: t("search-placeholder")
	});

	const {data, loading, error} = useQuery<{ gebruikers: IGebruiker[] }>(GetAllGebruikersQuery);
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
			setFilteredBurgers(data.gebruikers.filter(b => searchFields(search.value, [b.burger?.achternaam || "", b.burger?.voornamen || ""])));
		}

		return () => {
			mounted = false
		};
	}, [data, search.value]);

	useEffect(() => {
		if(error){
			console.error(error);
		}
	}, [error]);

	const onKeyDownOnSearchField = (e) => {
		if (e.key === "Escape") {
			search.clear();
		}
	};

	return (
		<Stack spacing={5}>
			<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
				<Stack direction={"row"} spacing={5} alignItems={"center"}>
					<Heading size={"lg"}>{t("citizens")}</Heading>
				</Stack>
				<Stack direction={"row"} spacing={5}>
					<InputGroup>
						<InputLeftElement><Icon name="search" color={"gray.300"} /></InputLeftElement>
						<Input type={"text"} {...search.bind} onKeyDown={onKeyDownOnSearchField} />
						{search.value.length > 0 && (
							<InputRightElement>
								<IconButton onClick={() => search.clear()} size={"xs"} variant={"link"} icon={"close"} aria-label={""} color={"gray.300"} children={null} />
							</InputRightElement>
						)}
					</InputGroup>
				</Stack>
			</Stack>


			{loading && ( // Waiting for data to arrive
				<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} p={20} spacing={10}>
					<Spinner />
				</Stack>
			)}
			{!loading && error && (
				<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} p={20} spacing={10}>
					<Box as={Empty} maxWidth={[200, 300, 400]} height={"auto"} />
					<Text fontSize={"sm"}>{t("burgers.errors.serverError")}</Text>
				</Stack>
			)}
			{!loading && !error && (<>
				{filteredBurgers.length === 0 && (<>
					{search.value.trim().length === 0 ? (
						<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} p={20} spacing={10}>
							<Box as={Empty} maxWidth={[200, 300, 400]} height={"auto"} />
							<Text fontSize={"sm"}>Voeg burgers toe door te klikken op de knop "Burger toevoegen"</Text>
							<Button size={"sm"} variantColor={"primary"} variant={"solid"} leftIcon={"add"}
							        onClick={() => push(Routes.CitizenNew)}>{t("add-citizen-button-label")}</Button>
						</Stack>
					) : (
						<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} p={20} spacing={10}>
							<Box as={Empty} maxWidth={[200, 300, 400]} height={"auto"} />
							<Text fontSize={"sm"}>{t("burgers.errors.noSearchResults")}</Text>
						</Stack>
					)}
				</>)}
				{filteredBurgers.length > 0 && (
					<SimpleGrid maxWidth={"100%"} columns={4} minChildWidth={200} spacing={5}>
						{search.value.trim().length === 0 && (
							<Button variantColor={"primary"} borderStyle={"dashed"} variant={"outline"} leftIcon={"add"} onClick={() => push(Routes.CitizenNew)}
							        h={"100%"} p={5}>{t("add-citizen-button-label")}</Button>)
						}
						{filteredBurgers.map(g => <GebruikerCard key={g.id} gebruiker={g} cursor={"pointer"} />)}
					</SimpleGrid>
				)}
			</>)}
		</Stack>
	)
};

export default CitizenList;