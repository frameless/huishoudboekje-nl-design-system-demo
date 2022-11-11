import {Box, Grid, GridItem, Stack} from "@chakra-ui/react";
import "@gemeente-denhaag/design-tokens-components";
import Divider from "@gemeente-denhaag/divider";
import {Heading2, Heading3, Heading5, Paragraph} from "@gemeente-denhaag/typography";
import React from "react";
import {useGetBurgerDetailsQuery} from "../../../generated/graphql";
import Queryable from "../../utils/Queryable";
import BackButton from "../BackButton";
import PrettyIban from "../PrettyIban";


const DetailBurgerView: React.FC<{bsn: number}> = ({bsn}) => {
	const $burger = useGetBurgerDetailsQuery({
		variables: {bsn},
	});

	return (
		<div>
			<BackButton label={"Huishoudboekje"} />
			<Heading2>Mijn gegevens</Heading2>
			<Queryable query={$burger} render={data => {
				const {rekeningen = []} = data.burger || {};

				return (
					<Box mt={3}>
						{rekeningen.map((rekening, i) => {
							return (
								<Stack key={i} mt={3}>
									<Heading3>Rekening</Heading3>
									<Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}>
										<GridItem>
											<Heading5>Rekeninghouder</Heading5>
										</GridItem>
										<GridItem>
											<Paragraph>{rekening.rekeninghouder}</Paragraph>
										</GridItem>
									</Grid>
									<Divider />
									<Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}>
										<GridItem>
											<Heading5>Iban</Heading5>
										</GridItem>
										<GridItem>
											<Paragraph><PrettyIban iban={rekening.iban} /></Paragraph>
										</GridItem>
									</Grid>
								</Stack>
							);
						})}
					</Box>
				);
			}} />
		</div>
	);
};

export default DetailBurgerView;
