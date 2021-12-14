import React from "react";
import {useParams} from "react-router-dom";
import {Afdeling, useGetAfdelingQuery} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import PageNotFound from "../PageNotFound";
import AfdelingDetailView from "./AfdelingDetailView";

export const AfdelingDetailPage = () => {
	const {id = ""} = useParams<{id: string}>();

	const $afdeling = useGetAfdelingQuery({
		variables: {
			id: parseInt(id),
		},
	});

	return (
		<Queryable query={$afdeling} children={(data => {
			const afdeling: Afdeling = data.afdeling;

			if (!afdeling) {
				return <PageNotFound />;
			}

			return (
				<AfdelingDetailView afdeling={afdeling} />
			);
		})} />
	);

};