import React, {useEffect, useState} from "react";
import {Box, Heading, Spinner, Stack} from "@chakra-ui/core";
import {useParams} from "react-router-dom";
import Routes from "../../config/routes";
import BackButton from "../BackButton";
import {GetCitizenByIdQuery} from "../../services/citizens";
import {useAsync} from "react-async";
import {ICitizen} from "../../models";

const CitizenDetail = () => {
	const {id} = useParams();
	const {data: _citizen, isPending} = useAsync({
		promiseFn: GetCitizenByIdQuery,
		id: parseInt(id)
	});
	const [citizen, setCitizen] = useState<ICitizen | null>(null);

	useEffect(() => {
		let mounted = true;

		if (mounted && !isPending && _citizen) {
			setCitizen(_citizen);
		}

		return () => {
			mounted = false;
		}
	}, [_citizen, isPending]);

	return (<>
		<BackButton to={Routes.Citizens} />

		{isPending && (
			<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
				<Spinner />
			</Stack>
		)}
		{!isPending && citizen && (
			<Stack spacing={5}>
				<Heading size={"lg"}>{citizen.firstName} {citizen.lastName}</Heading>

				<Stack bg={"white"} p={5}>
					<Box as={"pre"}>{JSON.stringify({
						bsn: citizen.bsn,
						initials: citizen.initials,
						firstName: citizen.firstName,
						lastName: citizen.lastName,
						dateOfBirth: citizen.dateOfBirth,
						mail: citizen.mail,
						street: citizen.street,
						houseNumber: citizen.houseNumber,
						zipcode: citizen.zipcode,
						city: citizen.city,
						phoneNumber: citizen.phoneNumber,
						iban: citizen.iban
					}, null, 2)}</Box>
				</Stack>
			</Stack>
		)}
	</>);
};

export default CitizenDetail;