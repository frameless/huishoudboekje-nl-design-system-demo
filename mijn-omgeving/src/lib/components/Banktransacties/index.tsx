import {Button, Flex, Spinner, Stack, Text} from "@chakra-ui/react";
import {Heading2} from "@gemeente-denhaag/typography";
import React, {useEffect, useRef, useState} from "react";
import {Banktransactie, useGetPagedBanktransactiesLazyQuery} from "../../../generated/graphql";
import BackButton from "../BackButton";
import BanktransactiesList from "./BanktransactiesList";

const BanktransactiesPage: React.FC<{ bsn: number }> = ({bsn}) => {
	const container = useRef<HTMLDivElement>(null);
	const [transacties, setTransacties] = useState<Banktransactie[]>([]);
	const [getTransacties, {data, loading: isLoading}] = useGetPagedBanktransactiesLazyQuery();
	const page = useRef<number>(0);
	const total = useRef<number>(0);
	const limit = 10;

	const onClickLoadMoreButton = () => {
		if (!isLoading) {
			loadMore();
		}
	};

	const loadMore = () => {
		if (transacties.length <= total.current) {
			getTransacties({
				variables: {
					bsn,
					limit,
					start: 1 + (page.current * limit),
				},
			}).then((result) => {
				const transacties = result.data?.burger?.banktransactiesPaged?.banktransacties;
				const _total = result.data?.burger?.banktransactiesPaged?.pageInfo?.count;

				if (_total) {
					total.current = _total;
				}

				if (transacties && transacties.length > 0) {
					setTransacties(t => [...t, ...transacties]);
					page.current += 1;
				}
			});
		}
	};

	useEffect(() => {
		loadMore();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	return (
		<div>
			<BackButton label={"Huishoudboekje"} />
			<Heading2>Banktransacties</Heading2>
			<br />
			<Flex justify={"center"}>
				{isLoading && total.current === 0 && (<Spinner />)}
			</Flex>
			<Stack ref={container}>
				{transacties.length > 0 ? (
					<>
						<BanktransactiesList transacties={transacties} />
						<Flex justify={"center"}>
							{(transacties.length < total.current) && (
								<Button isLoading={isLoading} onClick={() => onClickLoadMoreButton()}>Meer transacties laden</Button>
							)}
						</Flex>
					</>
				) : (
					data && <Text>Er zijn geen transacties gevonden.</Text>
				)}
			</Stack>
		</div>
	);

};

export default BanktransactiesPage;
