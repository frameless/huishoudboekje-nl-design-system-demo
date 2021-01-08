import {AddIcon, CloseIcon, SearchIcon} from "@chakra-ui/icons";
import {Button, IconButton, Input, InputGroup, InputLeftElement, InputRightElement} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useInput} from "react-grapple";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {Gebruiker, useGetAllBurgersQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {searchFields} from "../../utils/things";
import DeadEndPage from "../DeadEndPage";
import Page from "../Layouts/Page";
import BurgerListView from "./BurgerListView";

const BurgerList = () => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const search = useInput<string>({
		placeholder: t("forms.search.fields.search")
	});

	const [filteredBurgers, setFilteredBurgers] = useState<Gebruiker[]>([]);
	const $burgers = useGetAllBurgersQuery({
		fetchPolicy: "no-cache",
		onCompleted: ({gebruikers: burgers = []}) => {
			setFilteredBurgers(burgers);
		},
	});

	useEffect(() => {
		let mounted = true;

		const {data} = $burgers;

		if (mounted && data) {
			const {gebruikers: burgers = []} = data;
			setFilteredBurgers(burgers.filter(b => searchFields(search.value, [b.achternaam || "", b.voornamen || ""])));
		}

		return () => {
			mounted = false
		};
	}, [$burgers, search.value]);

	const onKeyDownOnSearch = (e) => {
		if (e.key === "Escape") {
			search.reset();
		}
	};

	const onClickResetSearch = () => {
		search.reset();
		search.ref.current!.focus();
	};

	return (
		<Queryable query={$burgers}>{({gebruikers: burgers = []}: { gebruikers: Gebruiker[] }) => {
			if (burgers.length === 0) {
				return (
					<DeadEndPage message={t("messages.burgers.addHint", {buttonLabel: t("actions.add")})}>
						<Button size={"sm"} colorScheme={"primary"} variant={"solid"} leftIcon={<AddIcon />}
						        onClick={() => push(Routes.CreateBurger)}>{t("actions.add")}</Button>
					</DeadEndPage>
				);
			}

			return (
				<Page title={t("burgers.burgers")} right={(
					<InputGroup>
						<InputLeftElement zIndex={0}><SearchIcon color={"gray.300"} /></InputLeftElement>
						<Input type={"text"} {...search.bind} bg={"white"} onKeyDown={onKeyDownOnSearch} />
						{search.value.length > 0 && (
							<InputRightElement zIndex={0}>
								<IconButton onClick={() => search.reset()} size={"xs"} variant={"link"} icon={<CloseIcon />} aria-label={t("actions.cancel")}
								            color={"gray.300"} />
							</InputRightElement>
						)}
					</InputGroup>
				)}>
					{filteredBurgers.length === 0 ? (
						<DeadEndPage message={t("messages.burgers.noSearchResults")}>
							<Button size="sm" colorScheme="primary" onClick={onClickResetSearch}>{t("actions.clearSearch")}</Button>
						</DeadEndPage>
					) : (
						<BurgerListView burgers={filteredBurgers} showAddButton={search.value.trim().length === 0} />
					)}
				</Page>
			);
		}}
		</Queryable>
	)
};

export default BurgerList;