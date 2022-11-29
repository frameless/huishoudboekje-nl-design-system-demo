import {Stack} from "@chakra-ui/react";
import React from "react";
import {useParams} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {Burger, useGetBurgerPersonalDetailsQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {formatBurgerName} from "../../utils/things";
import BackButton from "../shared/BackButton";
import Page from "../shared/Page";
import PageNotFound from "../shared/PageNotFound";
import BurgerProfileView from "./BurgerDetail/BurgerProfileView";
import BurgerRekeningenView from "./BurgerDetail/BurgerRekeningenView";

const BurgerPersonalDetailsPage = () => {
	const {id = ""} = useParams<{id: string}>();

	const $burger = useGetBurgerPersonalDetailsQuery({
		variables: {
			id: parseInt(id),
		},
	});

	return (
		<Queryable query={$burger}>{(data) => {
			const burger: Burger = data.burger;

			if (!burger) {
				return <PageNotFound />;
			}

			return (
				<Page title={formatBurgerName(burger)} backButton={(
					<Stack direction={["column", "row"]} spacing={[2, 5]}>
						<BackButton to={AppRoutes.ViewBurger(String(burger.id))} />
					</Stack>
				)}>
					<BurgerProfileView burger={burger} />
					<BurgerRekeningenView burger={burger} />
				</Page>
			);
		}}
		</Queryable>
	);
};

export default BurgerPersonalDetailsPage;
