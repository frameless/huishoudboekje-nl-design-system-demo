import {AddIcon, CloseIcon, SearchIcon} from "@chakra-ui/icons";
import {Button, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Stack} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useInput} from "react-grapple";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {Organisatie, useGetAllOrganisatiesQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {searchFields} from "../../utils/things";
import DeadEndPage from "../DeadEndPage";
import Page from "../Layouts/Page";
import OrganisatieListView from "./OrganisatieListView";

const OrganisatieList = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const search = useInput<string>({
		placeholder: t("forms.search.fields.search")
	});

	const [filteredOrganisaties, setFilteredOrganisaties] = useState<Organisatie[]>([]);
	const $organisaties = useGetAllOrganisatiesQuery({
		fetchPolicy: "no-cache",
		onCompleted: ({organisaties = []}) => {
			setFilteredOrganisaties(organisaties);
		}
	});

	useEffect(() => {
		let mounted = true;

		if (mounted && $organisaties.data) {
			const {organisaties = []} = $organisaties.data;
			setFilteredOrganisaties(organisaties.filter(o => searchFields(search.value, [o.weergaveNaam || ""])));
		}

		return () => {
			mounted = false
		};
	}, [$organisaties, search.value]);

	const onKeyDownOnSearchField = (e) => {
		if (e.key === "Escape") {
			search.clear();
		}
	};

	const onClickResetSearch = () => {
		search.reset();
		search.ref.current!.focus();
	};

	return (
		<Queryable query={$organisaties}>{({organisaties = []}: { organisaties: Organisatie[] }) => {
			if (organisaties.length === 0) {
				return (
					<DeadEndPage message={t("messages.organizations.addHint", {buttonLabel: t("actions.add")})}>
						<Button size={"sm"} colorScheme={"primary"} variant={"solid"} leftIcon={<AddIcon />}
						        onClick={() => push(Routes.CreateOrganisatie)}>{t("actions.add")}</Button>
					</DeadEndPage>
				);
			}

			return (
				<Page title={t("organizations.organizations")} right={(
					<Stack direction={"row"} spacing={5}>
						<InputGroup>
							<InputLeftElement><SearchIcon color={"gray.300"} /></InputLeftElement>
							<Input type={"text"} {...search.bind} bg={"white"} onKeyDown={onKeyDownOnSearchField} />
							{search.value.length > 0 && (
								<InputRightElement>
									<IconButton onClick={() => search.clear()} size={"xs"} variant={"link"} icon={<CloseIcon />} aria-label={t("actions.cancel")}
									            color={"gray.300"} />
								</InputRightElement>
							)}
						</InputGroup>
					</Stack>
				)}>
					{filteredOrganisaties.length === 0 ? (
						<DeadEndPage message={t("messages.organizations.noSearchResults")}>
							<Button size="sm" colorScheme="primary" onClick={onClickResetSearch}>{t("actions.clearSearch")}</Button>
						</DeadEndPage>
					) : (
						<OrganisatieListView organisaties={filteredOrganisaties} showAddButton={search.value.trim().length === 0} />
					)}
				</Page>
			);
		}}
		</Queryable>
	)
};

export default OrganisatieList;