import React, {useEffect, useState} from "react";
import {Button, Heading, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Spinner, Stack, useToast} from "@chakra-ui/core";
import Routes from "../../config/routes";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {useInput} from "react-grapple";
import {useQuery} from "@apollo/client";
import {IOrganisatie} from "../../models";
import {GetAllOrganisatiesQuery} from "../../services/graphql/queries";
import {searchFields} from "../../utils/things";
import DeadEndPage from "../DeadEndPage";
import OrganizationListView from "./OrganizationListView";

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

		if (data?.organisaties.length === 0) {
			return (
				<DeadEndPage message={t("messages.organizations.addHint", {buttonLabel: t("actions.add")})}>
					<Button size={"sm"} variantColor={"primary"} variant={"solid"} leftIcon={"add"}
					        onClick={() => push(Routes.CreateOrganization)}>{t("actions.add")}</Button>
				</DeadEndPage>
			);
		}

		if (filteredOrganisaties.length === 0) {
			return (
				<DeadEndPage message={t("messages.organizations.noSearchResults")}>
					<Button size="sm" variantColor="primary" onClick={onClickResetSearch}>{t("actions.clearSearch")}</Button>
				</DeadEndPage>
			);
		}

		return (<OrganizationListView organizations={filteredOrganisaties} showAddButton={search.value.trim().length === 0} />);
	}

	return (
		<Stack spacing={5}>
			<Stack direction={"row"} spacing={5} justifyContent={"space-between"} alignItems={"center"}>
				<Stack direction={"row"} spacing={5} alignItems={"center"}>
					<Heading size={"lg"}>{t("organizations.organizations")}</Heading>
				</Stack>
				{showSearch && (
					<Stack direction={"row"} spacing={5}>
						<InputGroup>
							<InputLeftElement><Icon name="search" color={"gray.300"} /></InputLeftElement>
							<Input type={"text"} {...search.bind} onKeyDown={onKeyDownOnSearchField} />
							{search.value.length > 0 && (
								<InputRightElement>
									<IconButton onClick={() => search.clear()} size={"xs"} variant={"link"} icon={"close"} aria-label={""} color={"gray.300"} />
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

export default OrganizationList;