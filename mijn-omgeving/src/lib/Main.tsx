import React from "react";
import {Card} from "@gemeente-denhaag/card";
import "./Main.css";
import {Heading2} from "@gemeente-denhaag/typography";


const Main = () => {
	return (
		<div>
			<Heading2>Huishoudboekje</Heading2>
			<div className={"gridContainer"}>
				<Card
					date={new Date()}
					href={"/toekomst"}
					subTitle={"Verwachte transacties"}
					title={"Toekomst"}
				/>
				<Card
					date={new Date()}
					href={"/banktransacties"}
					subTitle={"Overzicht van alle bij- en afschrijvingen."}
					title={"Banktransacties"}
				/>
				<Card
					date={new Date()}
					href={"/gegevens"}
					title={"Mijn gegevens"}
				/>
			</div>
		</div>
	)

};

export default Main;