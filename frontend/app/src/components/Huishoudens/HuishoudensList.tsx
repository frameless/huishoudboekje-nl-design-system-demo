import {CloseIcon, SearchIcon} from "@chakra-ui/icons";
import {Button, IconButton, Input, InputGroup, InputLeftElement, InputRightElement} from "@chakra-ui/react";
import _ from "lodash";
import {useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Outlet, useNavigate} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {Burger, Huishouden, useGetHuishoudensQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {searchFields} from "../../utils/things";
import AddButton from "../shared/AddButton";
import DeadEndPage from "../shared/DeadEndPage";
import Page from "../shared/Page";
import HuishoudensListView from "./HuishoudensListView";

const HuishoudensList = () => {
	const {t} = useTranslation();
	const navigate = useNavigate();
	const [search, setSearch] = useState<string>("");
	const searchRef = useRef<HTMLInputElement>(null);
	const $huishoudens = useGetHuishoudensQuery({fetchPolicy: "no-cache"});

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
			const burgers: Burger[] = data.burgers || [];
			const huishoudens: Huishouden[] = []
			const grouped = _.groupBy(burgers, burger => burger.huishoudenId)
			Object.keys(grouped).forEach(element =>
				huishoudens.push({id: Number(element), burgers: grouped[element]})
			)
			const filteredHuishoudens = huishoudens.filter(h => {
				return [
					searchFields(search, [
						...h.burgers?.map(b => b.achternaam || "") || [""],
					]),
				].some(t => t);
			});

			if (huishoudens.length === 0) {
				return (
					<Page title={t("huishoudens.title")}>
						<DeadEndPage message={t("messages.burgers.addHint", {buttonLabel: t("global.actions.add")})}>
							<AddButton onClick={() => navigate(AppRoutes.CreateBurger())} />
						</DeadEndPage>
					</Page>
				);
			}

			return (
				<Page title={t("huishoudens.title")} right={(
					// Todo: put this search field in it's own component (07-03-2022)
					<InputGroup>
						<InputLeftElement>
							<SearchIcon color={"gray.300"} />
						</InputLeftElement>
						<Input
						 	autoComplete="no"
							aria-autocomplete="none"
							type={"text"}
							onChange={e => setSearch(e.target.value)}
							bg={"white"}
							onKeyDown={onKeyDownOnSearch}
							placeholder={t("forms.search.fields.search")}
							ref={searchRef}
						/>
						{search.length > 0 && (
							<InputRightElement zIndex={0}>
								<IconButton onClick={() => setSearch("")} size={"xs"} variant={"link"} icon={
									<CloseIcon />} aria-label={t("global.actions.cancel")} color={"gray.300"} />
							</InputRightElement>
						)}
					</InputGroup>
				)}>
					{filteredHuishoudens.length === 0 ? (
						<DeadEndPage message={t("messages.noHuishoudenSearchResults")}>
							<Button size={"sm"} colorScheme={"primary"} onClick={onClickResetSearch}>{t("global.actions.clearSearch")}</Button>
						</DeadEndPage>
					) : (
						<HuishoudensListView huishoudens={filteredHuishoudens} />
					)}
					<Outlet />
				</Page>
			);
		}} />
	);
};

export default HuishoudensList;