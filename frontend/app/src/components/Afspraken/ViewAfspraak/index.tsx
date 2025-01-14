import React from "react";
import { useParams } from "react-router-dom";
import { Afspraak, useGetAfspraakQuery } from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import PageNotFound from "../../shared/PageNotFound";
import AfspraakDetailView from "./AfspraakDetailView";

const ViewAfspraak = () => {
	const { id = "" } = useParams<{ id: string }>();

	const $afspraak = useGetAfspraakQuery({
		fetchPolicy: "cache-and-network",
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

			return (
				<AfspraakDetailView afspraak={afspraak} />
			);
		}} />
	);
};

export default ViewAfspraak;