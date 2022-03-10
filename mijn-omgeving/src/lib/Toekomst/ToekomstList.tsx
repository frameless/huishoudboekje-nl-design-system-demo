import React from "react";
import {Afspraak} from "../../generated/graphql";
import {Stack} from "@chakra-ui/react";
import ToekomstListItem from "./ToekomstListItem";

const ToekomstList: React.FC<{ afspraken: Afspraak [] }> = ({afspraken}) => {


	return (
		<Stack>
			{afspraken.map((afspraak, i) => {
				return <ToekomstListItem afspraak={afspraak} key={i} />
			})}
		</Stack>
	);
};

export default ToekomstList;