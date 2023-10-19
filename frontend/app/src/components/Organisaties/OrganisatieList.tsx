import {CloseIcon, SearchIcon} from "@chakra-ui/icons";
import {Button, IconButton, Input, InputGroup, InputLeftElement, InputRightElement} from "@chakra-ui/react";
import React, {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {Organisatie, useGetSimpleOrganisatiesQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {searchFields} from "../../utils/things";
import DeadEndPage from "../shared/DeadEndPage";
import Page from "../shared/Page";
import AddButton from "../shared/AddButton";
import OrganisatieListView from "./OrganisatieListView";

const OrganisatieList = () => {
	const {t} = useTranslation();
	const navigate = useNavigate();
	const [search, setSearch] = useState<string>("");
	const searchRef = useRef<HTMLInputElement>(null);
	const $organisaties = useGetSimpleOrganisatiesQuery();

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
					<DeadEndPage message={t("messages.organisaties.addHint", {buttonLabel: t("global.actions.add")})}>
						<AddButton onClick={() => navigate(AppRoutes.CreateOrganisatie)} />
					</DeadEndPage>
				);
			}

			const filteredOrganisaties = organisaties.filter(o => {
				return [
					searchFields(search, [o.naam || ""]),
					searchFields(search.replaceAll(" ", ""), [
						...(o.afdelingen || []).flatMap(a => (a.rekeningen || []).flatMap(r => [r.rekeninghouder || "", r.iban || "", a.naam || ""])),
					]),
				].some(t => t);
			});

			return (
				<Page title={t("organizations.organizations")} right={(
					<InputGroup>
						<InputLeftElement>
							<SearchIcon color={"gray.300"} />
						</InputLeftElement>
						<Input
						 	autoComplete="no"
							aria-autocomplete="none"
							type={"text"}
							bg={"white"}
							onChange={e => setSearch(e.target.value)}
							onKeyDown={onKeyDownOnSearchField}
							value={search || ""}
							placeholder={t("forms.search.fields.search")}
							ref={searchRef}
						/>
						{search.length > 0 && (
							<InputRightElement>
								<IconButton size={"xs"} variant={"link"} icon={<CloseIcon />}
									aria-label={t("global.actions.cancel")} color={"gray.300"} onClick={() => setSearch("")} />
							</InputRightElement>
						)}
					</InputGroup>
				)}>
					{filteredOrganisaties.length === 0 ? (
						<DeadEndPage message={t("messages.organisaties.noSearchResults")}>
							<Button size={"sm"} colorScheme={"primary"} onClick={onClickResetSearch}>{t("global.actions.clearSearch")}</Button>
						</DeadEndPage>
					) : (
						<OrganisatieListView organisaties={[...filteredOrganisaties].sort((a, b) => {
							return (a.naam || "") < (b.naam || "") ? -1 : 1;
						})} showAddButton={search.trim().length === 0} />
					)}
				</Page>
			);
		}}
		</Queryable>
	);
};

export default OrganisatieList;
