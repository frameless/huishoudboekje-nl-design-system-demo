import {AddIcon, CloseIcon, SearchIcon} from "@chakra-ui/icons";
import {Button, IconButton, Input, InputGroup, InputLeftElement, InputRightElement} from "@chakra-ui/react";
import React, {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {Organisatie, useGetOrganisatiesQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {searchFields} from "../../utils/things";
import DeadEndPage from "../DeadEndPage";
import Page from "../Layouts/Page";
import OrganisatieListView from "./Views/OrganisatieListView";

const OrganisatieList = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const [search, setSearch] = useState<string>("");
	const searchRef = useRef<HTMLInputElement>(null);

	const $organisaties = useGetOrganisatiesQuery();

	const onKeyDownOnSearchField = (e) => {
		if (e.key === "Escape") {
			setSearch("");
		}
	};

	const onClickResetSearch = () => {
		setSearch("");
		searchRef.current!.focus();
	};

	return (
		<Queryable query={$organisaties}>{({organisaties = []}: {organisaties: Organisatie[]}) => {
			if (organisaties.length === 0) {
				return (
					<DeadEndPage message={t("messages.organisaties.addHint", {buttonLabel: t("actions.add")})}>
						<Button size={"sm"} colorScheme={"primary"} variant={"solid"} leftIcon={
							<AddIcon />} onClick={() => push(Routes.CreateOrganisatie)}>{t("actions.add")}</Button>
					</DeadEndPage>
				);
			}

			const filteredOrganisaties = organisaties.filter(o => {
				return [
					searchFields(search, [o.kvkDetails?.naam || ""]),
					searchFields(search.replaceAll(" ", ""), [...(o.rekeningen || []).map(r => r.iban || "")])
				].some(t => t);
			});

			return (
				<Page title={t("organizations.organizations")} right={(
					<InputGroup>
						<InputLeftElement>
							<SearchIcon color={"gray.300"} />
						</InputLeftElement>
						<Input type={"text"} bg={"white"} onChange={e => setSearch(e.target.value)} onKeyDown={onKeyDownOnSearchField} value={search || ""} placeholder={t("forms.search.fields.search")} ref={searchRef} />
						{search.length > 0 && (
							<InputRightElement>
								<IconButton size={"xs"} variant={"link"} icon={<CloseIcon />} aria-label={t("actions.cancel")} color={"gray.300"} onClick={() => setSearch("")} />
							</InputRightElement>
						)}
					</InputGroup>
				)}>
					{filteredOrganisaties.length === 0 ? (
						<DeadEndPage message={t("messages.organisaties.noSearchResults")}>
							<Button size={"sm"} colorScheme={"primary"} onClick={onClickResetSearch}>{t("actions.clearSearch")}</Button>
						</DeadEndPage>
					) : (
						<OrganisatieListView organisaties={filteredOrganisaties} showAddButton={search.trim().length === 0} />
					)}
				</Page>
			);
		}}
		</Queryable>
	);
};

export default OrganisatieList;