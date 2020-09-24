import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Box, Button, Heading, Icon, IconButton, Input, InputGroup, InputLeftElement, SimpleGrid, Stack, Text} from "@chakra-ui/core";
import CitizenCard from "./CitizenCard";
import {useInput, useIsMobile} from "react-grapple";
import {searchFields} from "../../utils/things";
import Routes from "../../config/routes";
import {useHistory} from "react-router-dom";
import {ReactComponent as Empty} from "../../assets/images/illustration-empty.svg";
import {sampleData} from "../../config/sampleData/sampleData";

const CitizenList = () => {
	const {t} = useTranslation();
	const isMobile = useIsMobile(650);
	const {push} = useHistory();
	const search = useInput<string>({
		placeholder: t("search-placeholder")
	});

	// Todo: make this a graphQL query and maybe pagination once this list becomes too long (50+ items)
	const allCitizens = sampleData.citizens;
	const [citizens, setCitizens] = useState(allCitizens);

	useEffect(() => {
		let mounted = true;

		console.log(search.value);

		if (mounted) {
			setCitizens(allCitizens.filter(c => searchFields(search.value, [c.firstName, c.lastName])));
		}

		return () => {
			mounted = false
		};

	}, [allCitizens, search.value]);

	return (
		<Stack spacing={5}>
			<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
				<Heading size={"lg"}>{t("citizens")}</Heading>
				<Stack direction={"row"} spacing={5}>
					<InputGroup>
						<InputLeftElement><Icon name="search" color={"gray.300"} /></InputLeftElement>
						<Input type={"text"} {...search.bind} />
					</InputGroup>
					{isMobile ? (
						<IconButton variantColor={"primary"} variant={"solid"} aria-label={t("add-citizen-button-label")} icon={"add"} onClick={() => push(Routes.CitizenNew)} />
					) : (
						<Button variantColor={"primary"} variant={"solid"} leftIcon={"add"} onClick={() => push(Routes.CitizenNew)}>{t("add-citizen-button-label")}</Button>
					)}
				</Stack>
			</Stack>

			<SimpleGrid maxWidth={"100%"} columns={4} minChildWidth={350} spacing={5}>
				{citizens.length === 0 && (
					<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} p={20} spacing={10}>
						<Box as={Empty} maxWidth={400} height={"auto"} />
						<Text fontSize={"sm"}>Voeg burgers toe door te klikken op de knop "Burger toevoegen"</Text>
						<Button size={"sm"} variantColor={"primary"} variant={"solid"} leftIcon={"add"}
						        onClick={() => push(Routes.CitizenNew)}>{t("add-citizen-button-label")}</Button>
					</Stack>
				)}
				{citizens.length > 0 && citizens.map(c => <CitizenCard key={c.id} citizen={c} cursor={"pointer"} />)}
			</SimpleGrid>
		</Stack>
	)
};

export default CitizenList;