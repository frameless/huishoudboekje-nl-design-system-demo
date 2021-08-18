import {AddIcon, CloseIcon, SearchIcon} from "@chakra-ui/icons";
import {Button, IconButton, Input, InputGroup, InputLeftElement, InputRightElement} from "@chakra-ui/react";
import React, {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {Burger, useGetBurgersSearchQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import DeadEndPage from "../DeadEndPage";
import Page from "../Layouts/Page";
import BurgerListView from "./BurgerListView";

const BurgerList = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const [search, setSearch] = useState<string>("");
	const searchRef = useRef<HTMLInputElement>(null);
	const $burgers = useGetBurgersSearchQuery({
		variables: {search: search.trim()},
	});

	const onKeyDownOnSearch = (e) => {
		if (e.key === "Escape") {
			setSearch("");
		}
	};

	const onClickResetSearch = () => {
		setSearch("");
		searchRef.current!.focus();
	};

	const onChangeSearch = e => {
		setSearch(e.target.value);
	};

	return (
		<Page title={t("burgers.burgers")} right={(
			<InputGroup>
				<InputLeftElement>
					<SearchIcon color={"gray.300"} />
				</InputLeftElement>
				<Input type={"text"} onChange={onChangeSearch} bg={"white"} onKeyDown={onKeyDownOnSearch} placeholder={t("forms.search.fields.search")} ref={searchRef} value={search || ""} />
				{search.length > 0 && (
					<InputRightElement zIndex={0}>
						<IconButton onClick={onClickResetSearch} size={"xs"} variant={"link"} icon={<CloseIcon />} aria-label={t("actions.cancel")} color={"gray.300"} />
					</InputRightElement>
				)}
			</InputGroup>
		)}>
			<Queryable query={$burgers} options={{hidePreviousResults: true}} children={(data) => {
				const burgers: Burger[] = data?.burgers || [];

				if (burgers.length === 0) {
					return search.length > 0 ? (
						<DeadEndPage message={t("messages.burgers.noSearchResults")}>
							<Button size={"sm"} colorScheme={"primary"} onClick={onClickResetSearch}>{t("actions.clearSearch")}</Button>
						</DeadEndPage>
					) : (
						<DeadEndPage message={t("messages.burgers.addHint", {buttonLabel: t("actions.add")})}>
							<Button size={"sm"} colorScheme={"primary"} variant={"solid"} leftIcon={
								<AddIcon />} onClick={() => push(Routes.CreateBurger)}>{t("actions.add")}</Button>
						</DeadEndPage>
					);
				}

				return (
					<BurgerListView burgers={burgers} showAddButton={search.trim().length === 0} />
				);
			}} />
		</Page>
	);
};

export default BurgerList;