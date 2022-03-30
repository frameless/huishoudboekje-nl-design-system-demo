import React, {useEffect, useRef, useState} from "react";
import BackButton from "../BackButton";
import {Heading2} from "@gemeente-denhaag/typography";
import BanktransactiesList from "./BanktransactiesList";
import {Burger, useGetPagedBanktransactiesLazyQuery} from "../../../generated/graphql";
import {Flex, Spinner, Stack} from "@chakra-ui/react";

const BanktransactiesPage: React.FC<{ bsn: number }> = ({bsn}) => {
	const container = useRef<HTMLDivElement>(null);
	const [transacties, setTransacties] = useState<Burger[]>([])
	const [getTransacties, {loading: isLoading}] = useGetPagedBanktransactiesLazyQuery();


	const onWindowScroll = () => {
		if (container.current) {
			const {scrollTop, clientHeight: windowHeight} = document.documentElement;
			const {offsetTop, clientHeight} = container.current;

			const positionOfBottom: number = offsetTop + clientHeight;
			const scrollMargin = 20;
			const shouldFetch: boolean = positionOfBottom < (windowHeight + scrollTop + scrollMargin);

			if (shouldFetch) {
				loadMore();
			}
		}
	};

	const [page, setPage] = useState<number>(0);
	const [total, setTotal] = useState<number | undefined>(undefined);
	const limit = 5;

	const loadMore = () => {
		if (!isLoading && (total === undefined || transacties.length <= total)) {
			getTransacties({
				variables: {
					bsn,
					limit,
					start: 1 + (page * limit),
				},
			}).then((result) => {
				const transacties = result.data?.burger?.banktransactiesPaged?.banktransacties;
				const total = result.data?.burger?.banktransactiesPaged?.pageInfo?.count;

				if (total) {
					setTotal(total);
				}

				if (transacties && transacties.length > 0) {
					setTransacties(t => [...t, ...transacties]);
					setPage(p => p + 1);
				}
			});
		}
	};

	useEffect(() => {
		window.onscroll = onWindowScroll;
		onWindowScroll();

		return () => {
			window.onscroll = null;
		};

	},);


	return (
		<div>
			<BackButton label={"Huishoudboekje"} />
			<Heading2>Banktransacties</Heading2>
			<Stack ref={container}>
				<BanktransactiesList transacties={transacties} />
				<Flex align={"center"} justify={"center"}>
					{isLoading && <Spinner />}
				</Flex>
			</Stack>
		</div>
	)

};

export default BanktransactiesPage;