import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSampleData} from "../../utils/hooks";
import {Heading, Icon, Input, InputGroup, InputLeftElement, SimpleGrid, Stack} from "@chakra-ui/core";
import CitizenCard from "./CitizenCard";
import {useInput} from "react-grapple";
import {searchFields} from "../../utils/things";

const CitizenList = () => {
	const {t} = useTranslation();
	const search = useInput<string>();

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
				<InputGroup>
					<InputLeftElement><Icon name="search" color="gray.300" /></InputLeftElement>
					<Input type={"text"} placeholder={t("zoeken")} {...search.bind} />
				</InputGroup>
			</Stack>

			<SimpleGrid maxWidth={"100%"} columns={4} minChildWidth={350} spacing={5}>
				{citizens && citizens.map(c => <CitizenCard key={c.id} citizen={c} cursor={"pointer"} />)}
			</SimpleGrid>
		</Stack>
	)
};

export default CitizenList;