import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Box, Button, Heading, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, SimpleGrid, Spinner, Stack, Text} from "@chakra-ui/core";
import CitizenCard from "./CitizenCard";
import {useInput} from "react-grapple";
import {searchFields} from "../../utils/things";
import Routes from "../../config/routes";
import {useHistory} from "react-router-dom";
import {ReactComponent as Empty} from "../../assets/images/illustration-empty.svg";
import {useAsync} from "react-async";
import {GetCitizensQuery} from "../../services/citizens";

const CitizenList = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const search = useInput<string>({
		placeholder: t("search-placeholder")
	});

	// Todo: make this a graphQL query and maybe pagination once this list becomes too long (50+ items)
	const {data: allCitizens, isPending} = useAsync({promiseFn: GetCitizensQuery});
	const [citizens, setCitizens] = useState(allCitizens || []);

	useEffect(() => {
		let mounted = true;

		if (mounted && !isPending && allCitizens) {
			setCitizens(allCitizens);
		}

		return () => {
			mounted = false
		};
	}, [allCitizens, isPending]);

	useEffect(() => {
		let mounted = true;

		if (mounted && allCitizens) {
			setCitizens(allCitizens.filter(c => searchFields(search.value, [c.firstName, c.lastName])));
		}

		return () => {
			mounted = false
		};
	}, [allCitizens, search.value]);

	const isLoading = isPending;
	const noData = !isPending && (!allCitizens || allCitizens.length === 0);
	const noSearchResults = !isPending && search.value.length > 0 && citizens.length === 0;
	const resultsFound = !isPending && citizens.length > 0;
	const showSearch = !isPending && !noData;
	const noActiveSearch = citizens.length === allCitizens?.length;

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
					{showSearch && (
						<InputGroup>
							<InputLeftElement><Icon name="search" color={"gray.300"} /></InputLeftElement>
							<Input type={"text"} {...search.bind} onKeyDown={onKeyDownOnSearchField} />
							{search.value.length > 0 && (
								<InputRightElement>
									<IconButton onClick={() => search.clear()} size={"xs"} variant={"link"} icon={"close"} aria-label={""} color={"gray.300"} />
								</InputRightElement>
							)}
						</InputGroup>
					)}
				</Stack>
			</Stack>

			{isLoading && ( // Waiting for data to arrive
				<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} p={20} spacing={10}>
					<Spinner />
				</Stack>
			)}
			{noData && ( // Waiting over, but no results found
				<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} p={20} spacing={10}>
					<Box as={Empty} maxWidth={[200, 300, 400]} height={"auto"} />
					<Text fontSize={"sm"}>Voeg burgers toe door te klikken op de knop "Burger toevoegen"</Text>
					<Button size={"sm"} variantColor={"primary"} variant={"solid"} leftIcon={"add"}
					        onClick={() => push(Routes.CitizenNew)}>{t("add-citizen-button-label")}</Button>
				</Stack>
			)}
			{resultsFound && (
				<SimpleGrid maxWidth={"100%"} columns={4} minChildWidth={200} spacing={5}>
					{noActiveSearch && (
						<Button variantColor={"primary"} borderStyle={"dashed"} variant={"outline"} leftIcon={"add"} onClick={() => push(Routes.CitizenNew)}
						        h={"100%"} p={5}>{t("add-citizen-button-label")}</Button>)
					}
					{citizens.map(c => <CitizenCard key={c.id} citizen={c} cursor={"pointer"} />)}
				</SimpleGrid>
			)}
			{noSearchResults && (
				<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} p={20} spacing={10}>
					<Box as={Empty} maxWidth={[200, 300, 400]} height={"auto"} />
					<Text fontSize={"sm"}>Geen burgers gevonden. Gebruik een andere zoekterm.</Text>
				</Stack>
			)}
		</Stack>
	)
};

export default CitizenList;