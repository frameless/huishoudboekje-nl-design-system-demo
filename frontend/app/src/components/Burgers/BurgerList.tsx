import {CloseIcon, SearchIcon} from "@chakra-ui/icons";
import {Button, IconButton, Input, InputGroup, InputLeftElement, InputRightElement} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {Burger, useGetBurgersSearchQuery} from "../../generated/graphql";
import {useStore} from "../../store";
import Queryable from "../../utils/Queryable";
import AddButton from "../shared/AddButton";
import DeadEndPage from "../shared/DeadEndPage";
import Page from "../shared/Page";
import BurgerListView from "./BurgerListView";

const BurgerList = () => {
	const {t} = useTranslation();
	const navigate = useNavigate();
	const {store, updateStore} = useStore();
	const searchRef = useRef<HTMLInputElement>(null);
	const $burgers = useGetBurgersSearchQuery({
		context: {debounceKey: "burgerSearch"},
		variables: {
			search: store.burgerSearch,
		},
	});

	const onChangeSearch = (e) => {
		updateStore("burgerSearch", e.target.value);
	};

	const onClickResetSearch = () => {
		updateStore("burgerSearch", "");
		searchRef.current!.focus();
	};

	return (
		<Page title={t("burgers.burgers")} right={(
			<InputGroup>
				<InputLeftElement>
					<SearchIcon color={"gray.300"} />
				</InputLeftElement>
				<Input type={"text"} onChange={onChangeSearch} bg={"white"} placeholder={t("forms.search.fields.search")} ref={searchRef} value={store.burgerSearch || ""} />
				{store.burgerSearch.length > 0 && (
					<InputRightElement zIndex={0}>
						<IconButton onClick={onClickResetSearch} size={"xs"} variant={"link"} icon={<CloseIcon />} aria-label={t("global.actions.cancel")} color={"gray.300"} />
					</InputRightElement>
				)}
			</InputGroup>
		)}>
			<Queryable query={$burgers} options={{hidePreviousResults: true}} children={(data) => {
				const burgers: Burger[] = data?.burgers || [];

				if (burgers.length === 0) {
					return store.burgerSearch.length > 0 ? (
						<DeadEndPage message={t("messages.burgers.noSearchResults")}>
							<Button size={"sm"} colorScheme={"primary"} onClick={onClickResetSearch}>{t("global.actions.clearSearch")}</Button>
						</DeadEndPage>
					) : (
						<DeadEndPage message={t("messages.burgers.addHint", {buttonLabel: t("global.actions.add")})}>
							<AddButton onClick={() => navigate(AppRoutes.CreateBurger())} />
						</DeadEndPage>
					);
				}

				return (
					<BurgerListView burgers={burgers} showAddButton={store.burgerSearch.length === 0} />
				);
			}} />
		</Page>
	);
};

export default BurgerList;