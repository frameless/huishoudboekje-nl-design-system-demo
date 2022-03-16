import React from "react";
import {Card} from "@gemeente-denhaag/card";
import {useTranslation} from "react-i18next";
import "./Main.css";
import {Heading2} from "@gemeente-denhaag/typography";


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
				<Card
					date={new Date()}
					href={"/gegevens"}
					title={t("detailBurger.title")}
				/>
			</div>
		</div>
	)

};

export default Main;