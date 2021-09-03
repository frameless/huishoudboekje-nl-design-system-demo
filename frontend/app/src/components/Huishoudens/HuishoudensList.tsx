import {AddIcon, CloseIcon, SearchIcon} from "@chakra-ui/icons";
import {Button, IconButton, Input, InputGroup, InputLeftElement, InputRightElement} from "@chakra-ui/react";
import React, {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {Huishouden, useGetHuishoudensQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {searchFields} from "../../utils/things";
import DeadEndPage from "../DeadEndPage";
import Page from "../Layouts/Page";
import HuishoudensListView from "./HuishoudensListView";

const HuishoudensList = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const [search, setSearch] = useState<string>("");
	const searchRef = useRef<HTMLInputElement>(null);
	const $huishoudens = useGetHuishoudensQuery();

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
		<Queryable query={$huishoudens} children={data => {
			const huishoudens: Huishouden[] = data.huishoudens || [];
			const filteredHuishoudens = huishoudens.filter(h => {
				return [
					searchFields(search, [
						...h.burgers?.map(b => b.achternaam || "") || [""],
					]),
				].some(t => t);
			});

			if (huishoudens.length === 0) {
				return (
					<DeadEndPage message={t("messages.burgers.addHint", {buttonLabel: t("global.actions.add")})}>
						<Button size={"sm"} colorScheme={"primary"} variant={"solid"} leftIcon={<AddIcon />}
							onClick={() => push(Routes.CreateBurger)}>{t("global.actions.add")}</Button>
					</DeadEndPage>
				);
			}

			return (
				<Page title={t("huishoudens.title")} right={(
					<InputGroup>
						<InputLeftElement>
							<SearchIcon color={"gray.300"} />
						</InputLeftElement>
						<Input type={"text"} onChange={e => setSearch(e.target.value)} bg={"white"} onKeyDown={onKeyDownOnSearch} placeholder={t("forms.search.fields.search")} ref={searchRef} />
						{search.length > 0 && (
							<InputRightElement zIndex={0}>
								<IconButton onClick={() => setSearch("")} size={"xs"} variant={"link"} icon={<CloseIcon />} aria-label={t("global.actions.cancel")} color={"gray.300"} />
							</InputRightElement>
						)}
					</InputGroup>
				)}>
					{filteredHuishoudens.length === 0 ? (
						<DeadEndPage message={t("messages.noHuishoudenSearchResults")}>
							<Button size="sm" colorScheme="primary" onClick={onClickResetSearch}>{t("global.actions.clearSearch")}</Button>
						</DeadEndPage>
					) : (
						<HuishoudensListView huishoudens={filteredHuishoudens} />
					)}
				</Page>
			);
		}} />
	);
};

export default HuishoudensList;