import {AddIcon, CloseIcon, SearchIcon} from "@chakra-ui/icons";
import {Button, IconButton, Input, InputGroup, InputLeftElement, InputRightElement} from "@chakra-ui/react";
import React, {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {Burger, useGetBurgersQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {searchFields} from "../../utils/things";
import DeadEndPage from "../DeadEndPage";
import Page from "../Layouts/Page";
import BurgerListView from "./BurgerListView";

const BurgerList = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const [search, setSearch] = useState<string>("");
	const searchRef = useRef<HTMLInputElement>(null);
	const $burgers = useGetBurgersQuery();

	const onKeyDownOnSearch = (e) => {
		if (e.key === "Escape") {
			setSearch("");
		}
	};

	const onClickResetSearch = () => {
		setSearch("");
		searchRef.current!.focus();
	};

	return (
		<Queryable query={$burgers}>{(data) => {
			const burgers: Burger[] = data?.burgers || [];
			const filteredBurgers = burgers.filter(b => {
				return [
					searchFields(search, [
						String(b.bsn),
						b.achternaam || "",
						b.voornamen || "",
						...(b.afspraken || []).flatMap(a => [
							a.organisatie?.kvkDetails?.naam || "",
							...(a.zoektermen || [""]),
						]),
					]),
					searchFields(search.replaceAll(" ", ""), [...(b.rekeningen || []).map(r => r.iban || "")]),
				].some(t => t);
			});

			if (burgers.length === 0) {
				return (
					<DeadEndPage message={t("messages.burgers.addHint", {buttonLabel: t("actions.add")})}>
						<Button size={"sm"} colorScheme={"primary"} variant={"solid"} leftIcon={<AddIcon />} onClick={() => push(Routes.CreateBurger)}>{t("actions.add")}</Button>
					</DeadEndPage>
				);
			}

			return (
				<Page title={t("burgers.burgers")} right={(
					<InputGroup>
						<InputLeftElement>
							<SearchIcon color={"gray.300"} />
						</InputLeftElement>
						<Input type={"text"} onChange={e => setSearch(e.target.value)} bg={"white"} onKeyDown={onKeyDownOnSearch} placeholder={t("forms.search.fields.search")} ref={searchRef} />
						{search.length > 0 && (
							<InputRightElement zIndex={0}>
								<IconButton onClick={() => setSearch("")} size={"xs"} variant={"link"} icon={<CloseIcon />} aria-label={t("actions.cancel")} color={"gray.300"} />
							</InputRightElement>
						)}
					</InputGroup>
				)}>
					{filteredBurgers.length === 0 ? (
						<DeadEndPage message={t("messages.burgers.noSearchResults")}>
							<Button size="sm" colorScheme="primary" onClick={onClickResetSearch}>{t("actions.clearSearch")}</Button>
						</DeadEndPage>
					) : (
						<BurgerListView burgers={filteredBurgers} showAddButton={search.trim().length === 0} />
					)}
				</Page>
			);
		}}
		</Queryable>
	);
};

export default BurgerList;