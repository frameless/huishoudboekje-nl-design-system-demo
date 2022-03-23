import {Grid, GridItem} from "@chakra-ui/react";
import {Card} from "@gemeente-denhaag/card";
import {Heading2} from "@gemeente-denhaag/typography";
import React from "react";
import {NavLink} from "../utils/Router";

const Dashboard = () => {
	return (
		<div>
			<Heading2>Huishoudboekje</Heading2>
			<Grid templateColumns={"repeat(2, 1fr)"} gap={10}>
				<GridItem>
					<NavLink to={"/toekomst"}>
						<Card
							date={new Date()}
							title={"Toekomst"}
							subTitle={"Verwachte transacties"}
						/>
					</NavLink>
				</GridItem>
				<GridItem>
					<NavLink to={"/banktransacties"}>
						<Card
							date={new Date()}
							title={"Banktransacties"}
							subTitle={"Overzicht van alle bij- en afschrijvingen."}
						/>
					</NavLink>
				</GridItem>
				<GridItem>
					<NavLink to={"/gegevens"}>
						<Card
							date={new Date()}
							title={"Mijn gegevens"}
						/>
					</NavLink>
				</GridItem>
			</Grid>
		</div>
	);

};

export default Dashboard;