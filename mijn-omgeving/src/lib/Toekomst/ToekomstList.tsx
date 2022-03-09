import React from "react";
import {Rekening} from "../../generated/graphql";
import {Stack} from "@chakra-ui/react";
import ToekomstListItem from "./ToekomstListItem";

const ToekomstList: React.FC<{ rekeningen: Rekening [] }> = ({rekeningen}) => {

	return (
		<Stack>
			{rekeningen.map((rekening, i) => {
				return <ToekomstListItem rekening={rekening} key={i} />
			})}
		</Stack>
	);
};

export default ToekomstList;