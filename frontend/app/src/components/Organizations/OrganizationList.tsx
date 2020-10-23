import React, {useEffect, useState} from "react";
import {Box, Button, Grid, Heading, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Spinner, Stack, Text, useToast} from "@chakra-ui/core";
import Routes from "../../config/routes";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {useInput} from "react-grapple";
import {useQuery} from "@apollo/client";
import {IOrganisatie} from "../../models";
import {GetAllOrganisatiesQuery} from "../../services/graphql/queries";
import NoOrganizationsFound from "./NoOrganizationsFound";
import OrganizationCard from "./OrganizationCard";
import {searchFields} from "../../utils/things";
import NoOrganizationSearchResults from "./NoOrganizationSearchResults";
import EmptyIllustration from "../Illustrations/EmptyIllustration";

const OrganizationList = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const toast = useToast();
	const search = useInput<string>({
		placeholder: t("forms.search.fields.search")
	});

	const {data, loading, error} = useQuery<{ organisaties: IOrganisatie[] }>(GetAllOrganisatiesQuery, {
		// This forces a refetch when we're routed back to this page after a mutation.
		fetchPolicy: "no-cache"
	});
	const [filteredOrganisaties, setFilteredOrganisaties] = useState<IOrganisatie[]>([]);

	useEffect(() => {
		if (data) {
			if (data.organisaties) {
				setFilteredOrganisaties(data.organisaties);
			}
		}
	}, [data, error, t, toast])

	useEffect(() => {
		let mounted = true;

		if (mounted && data && data.organisaties) {
			setFilteredOrganisaties(data.organisaties.filter(o => searchFields(search.value, [o.weergaveNaam])));
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

	const showSearch = (!loading && data && !error && data.organisaties.length > 0);

	return (
		<Stack spacing={5}>
			<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
				<Stack direction={"row"} spacing={5} alignItems={"center"}>
					<Heading size={"lg"}>{t("organizations.organizations")}</Heading>
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
				{filteredOrganisaties.length === 0 && (<>
					{search.value.trim().length === 0 ? (
						<NoOrganizationsFound />
					) : (
						<NoOrganizationSearchResults onSearchReset={() => {
							search.clear();
							search.ref.current!.focus();
						}} />
					)}
				</>)}
				{filteredOrganisaties.length > 0 && (
					<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)", "repeat(6, 1fr)"]} gap={5}>
						{search.value.trim().length === 0 && (
							<Box>
								<Button variantColor={"blue"} borderStyle={"dashed"} variant={"outline"} leftIcon={"add"}
								        w="100%" h="100%" onClick={() => push(Routes.CreateOrganization)} borderRadius={5}
								        p={5}>{t("buttons.organizations.createNew")}</Button>
							</Box>
						)}
						{filteredOrganisaties.map(o => (
							<OrganizationCard key={o.id} organization={o} cursor={"pointer"} />
						))}
					</Grid>
				)}
			</>)}
		</Stack>
	)
};

export default OrganizationList;