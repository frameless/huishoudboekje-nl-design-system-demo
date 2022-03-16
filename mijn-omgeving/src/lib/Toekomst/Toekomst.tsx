import React from "react";
import {useGetBurgerQuery} from "../../generated/graphql";
import Queryable from "../Queryable";
import ToekomstList from "./ToekomstList";
import {Link} from "@gemeente-denhaag/link";
import {ArrowLeftIcon} from "@gemeente-denhaag/icons";
import {Heading2} from "@gemeente-denhaag/components-react";
import {useTranslation} from "react-i18next";

const Toekomst: React.FC<{ bsn: number }> = ({bsn}) => {
	const {t} = useTranslation();
	const $burger = useGetBurgerQuery({
		variables: {bsn},
	});

	return (
		<Queryable query={$burger} render={data => {
			const {rekeningen = [], afspraken = []} = data.burger || {};

			const burgerRekeningenIds: number[] = rekeningen.map(r => r.id);
			const filteredAfspraken = afspraken.filter(a => burgerRekeningenIds.includes(a.tegenrekening?.id));

			// return (<pre> {JSON.stringify(afspraken, null, 2)}</pre>)
			return (
				<div>
					<div>
						<Link href={"/"} icon={<ArrowLeftIcon />} iconAlign={"start"}>{t("title")}</Link>
						<Heading2>{t("toekomst.title")}</Heading2>
					</div>
					<ToekomstList afspraken={filteredAfspraken} />
				</div>
			)
		}} />
	);
};

export default Toekomst;