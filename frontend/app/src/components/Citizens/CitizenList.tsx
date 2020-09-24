import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSampleData} from "../../utils/hooks";
import {Button, Heading, Icon, IconButton, Input, InputGroup, InputLeftElement, SimpleGrid, Stack} from "@chakra-ui/core";
import CitizenCard from "./CitizenCard";
import {useInput, useIsMobile} from "react-grapple";
import {searchFields} from "../../utils/things";
import Routes from "../../config/routes";
import {useHistory} from "react-router-dom";

const CitizenList = () => {
	const {t} = useTranslation();
	const isMobile = useIsMobile(650);
	const {push} = useHistory();
	const search = useInput<string>({
		placeholder: t("search-placeholder")
	});

	// Todo: make this a graphQL query and maybe pagination once this list becomes too long (50+ items)
	const allCitizens = useSampleData().citizens;
	const [citizens, setCitizens] = useState(allCitizens);

	useEffect(() => {
		setCitizens(allCitizens.filter(c => searchFields(search.value, [c.firstName, c.lastName])));
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
				{citizens && citizens.map(c => <CitizenCard key={c.id} citizen={c} cursor={"pointer"} />)}
			</SimpleGrid>
		</Stack>
	)
};

export default CitizenList;