import React from "react";
import {Card} from "@gemeente-denhaag/card";
import {useTranslation} from "react-i18next";
import "./Main.css";
import {Heading2} from "@gemeente-denhaag/components-react";


const Main = () => {
	const {t} = useTranslation();

	return (
		<div>
			<Heading2>{t("title")}</Heading2>
			<div className={"gridContainer"}>
				<Card
					date={new Date()}
					href={"/toekomst"}
					subTitle={t("card.futureContext")}
					title={t("card.future")}
				/>
				<Card
					date={new Date()}
					href={"/banktransacties"}
					subTitle={t("card.transactionsContext")}
					title={t("card.transactions")}
				/>
			</div>
		</div>
	)

};

export default Main;