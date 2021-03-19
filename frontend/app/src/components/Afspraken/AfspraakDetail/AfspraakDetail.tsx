import React from "react";
import {useParams} from "react-router-dom";
import {Afspraak, useGetOneAfspraakQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import PageNotFound from "../../PageNotFound";
import AfspraakDetailView from "./AfspraakDetailView";

const AfspraakDetail = () => {
	const {id} = useParams<{id: string}>();
	const $afspraak = useGetOneAfspraakQuery({
		variables: {
			id: parseInt(id),
		},
	});

	return (
		<Queryable query={$afspraak} children={(data) => {
			const afspraak: Afspraak = data.afspraak;

			if (!afspraak) {
				return <PageNotFound />;
			}

			return <AfspraakDetailView afspraak={afspraak} />;
		}} />
	);
};

export default AfspraakDetail;