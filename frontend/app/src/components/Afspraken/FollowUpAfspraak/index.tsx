import {useParams} from "react-router-dom";
import {Afspraak, useGetAfspraakFormDataQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import PageNotFound from "../../shared/PageNotFound";
import FollowUpAfspraakPage from "./FollowUpAfspraakPage";

const FollowUpAfspraak = () => {
	const {id = ""} = useParams<{id: string}>();

	const $afspraak = useGetAfspraakFormDataQuery({
		variables: {
			afspraakId: parseInt(id),
		},
	});

	return (
		<Queryable query={$afspraak} children={(data) => {
			const afspraak: Afspraak = data.afspraak;

			if (!afspraak.burger?.id) {
				return <PageNotFound />
			}

			return <FollowUpAfspraakPage data={data}></FollowUpAfspraakPage>
		}} />
	)
}

export default FollowUpAfspraak
