import React from "react";
import {Heading, Stack} from "@chakra-ui/core";
import CitizenCard from "./CitizenCard";
import {useParams} from "react-router-dom";
import {useSampleData} from "../../utils/hooks";
import Routes from "../../config/routes";
import BackButton from "../BackButton";

const CitizenDetail = () => {
	const {id} = useParams();

	// Todo: make this a graphQL query
	const citizen = useSampleData().citizens.find(c => c.id === parseInt(id));

	return (<>
		<BackButton to={Routes.Citizens} />

		<Stack spacing={5}>
			<Heading size={"lg"}>{citizen.firstName} {citizen.lastName}</Heading>
			<CitizenCard citizen={citizen} />
		</Stack>
	</>
	);
};

export default CitizenDetail;