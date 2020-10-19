import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useInput} from "react-grapple";
import {useHistory} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {searchFields} from "../../utils/things";
import {Box, Button, Grid, Heading, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Spinner, Stack, Text, useToast} from "@chakra-ui/core";
import Routes from "../../config/routes";
import GebruikerCard from "./GebruikerCard";
import {IGebruiker} from "../../models";
import {GetAllGebruikersQuery} from "../../services/graphql/queries";
import NoBurgersFound from "./NoBurgersFound";
import NoBurgerSearchResults from "./NoBurgerSearchResults";
import EmptyIllustration from "../Illustrations/EmptyIllustration";

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
			setFilteredBurgers(data.gebruikers.filter(b => searchFields(search.value, [b.burger?.achternaam || "", b.burger?.voornamen || ""])));
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

	const onKeyDownOnSearchField = (e) => {
		if (e.key === "Escape") {
			search.clear();
		}
	};

	const showSearch = (!loading && data && !error && data.gebruikers.length > 0);

	return (
		<Stack spacing={5}>
			<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
				<Stack direction={"row"} spacing={5} alignItems={"center"}>
					<Heading size={"lg"}>{t("burgers.burgers")}</Heading>
				</Stack>
				{showSearch && <Stack direction={"row"} spacing={5}>
					<InputGroup>
						<InputLeftElement><Icon name="search" color={"gray.300"} /></InputLeftElement>
						<Input type={"text"} {...search.bind} onKeyDown={onKeyDownOnSearchField} />
						{search.value.length > 0 && (
							<InputRightElement>
								<IconButton onClick={() => search.clear()} size={"xs"} variant={"link"} icon={"close"} aria-label={""} color={"gray.300"} children={null} />
							</InputRightElement>
						)}
					</InputGroup>
				</Stack>}
			</Stack>

			{loading && ( // Waiting for data to arrive
				<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} borderRadius={5} p={20} spacing={10}>
					<Spinner />
				</Stack>
			)}
			{!loading && error && (
				<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} borderRadius={5} p={20} spacing={10}>
					<Box as={EmptyIllustration} maxWidth={[200, 300, 400]} height={"auto"} />
					<Text fontSize={"sm"}>{t("messages.genericError.description")}</Text>
				</Stack>
			)}
			{!loading && !error && (<>
				{filteredBurgers.length === 0 && (<>
					{search.value.trim().length === 0 ? (
						<NoBurgersFound />
					) : (
						<NoBurgerSearchResults onSearchReset={() => {
							search.clear();
							search.ref.current!.focus();
						}} />
					)}
				</>)}
				{filteredBurgers.length > 0 && (
					<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)", "repeat(6, 1fr)"]} gap={5}>
						{search.value.trim().length === 0 && (
							<Box>
								<Button variantColor={"blue"} borderStyle={"dashed"} variant={"outline"} leftIcon={"add"}
								        w="100%" h="100%" onClick={() => push(Routes.CitizenNew)} borderRadius={5}
								        p={5}>{t("buttons.burgers.createNew")}</Button>
							</Box>
						)}
						{filteredBurgers.map(g => <GebruikerCard key={g.id} gebruiker={g} cursor={"pointer"} />)}
					</Grid>
				)}
			</>)}
		</Stack>
	)
};

export default BurgerList;