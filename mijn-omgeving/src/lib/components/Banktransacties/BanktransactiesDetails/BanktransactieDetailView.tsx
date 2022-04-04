import React, {useEffect, useRef, useState} from "react";
import {Banktransactie, useGetPagedBanktransactiesLazyQuery} from "../../../../generated/graphql";
import {Box, Button, Center, Flex, HStack, IconButton, Stack, Text} from "@chakra-ui/react";
import d from "../../../utils/dayjs";
import {ChevronDownIcon, ChevronUpIcon} from "@gemeente-denhaag/icons";
import Divider from "@gemeente-denhaag/divider";
import PrettyIban from "../../PrettyIban";
import {currencyFormat} from "../../../utils/numberFormat";
import {dateString} from "../../../utils/dateFormat";
import BackButton from "../../BackButton";
import BanktransactiesList from "../BanktransactiesList";
import {Heading5} from "@gemeente-denhaag/components-react";

const BanktransactieDetailView: React.FC<{ transactie: Banktransactie, bsn: number }> = ({transactie, bsn}) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const container = useRef<HTMLDivElement>(null);
	const [transacties, setTransacties] = useState<Banktransactie[]>([]);
	const [getTransacties, {loading: isLoading}] = useGetPagedBanktransactiesLazyQuery();
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

	const filteredRekeninghouders = (transacties.filter(b => transactie.tegenrekeningIban === b.tegenrekeningIban)).filter(b => transactie.id !== b.id).sort((a, b) => {
		return (a.transactiedatum && b.transactiedatum) && a.transactiedatum < b.transactiedatum ? 1 : -1;
	});


	return (
		<div>
			<BackButton to={"/banktransacties"} />
			<Stack>
				<Center>
					<Box>
						<Text fontSize={"xl"}>{transactie.tegenrekening?.rekeninghouder || (
							<PrettyIban iban={transactie.tegenrekeningIban} />
						)}</Text>
					</Box>
				</Center>
				<Center>
					<Box>
						<Text fontSize={"xl"}>{currencyFormat.format(transactie.bedrag)}</Text>
					</Box>
				</Center>
				<Box>
					<Text color={"gray"} fontSize={"sm"}>Uitvoering</Text>
					<Text>{dateString(d(transactie.transactiedatum, "YYYY-MM-DD").toDate())}</Text>
					<Divider />
				</Box>
				<Box>
					<Text color={"gray"} fontSize={"sm"}>{transactie.isCredit ? "Van rekening" : "Naar rekening"}</Text>
					<PrettyIban iban={transactie.tegenrekeningIban} />
					<Divider />
				</Box>
				<Box>
					<Text color={"gray"} fontSize={"sm"}>Omschrijving</Text>
					<Text>{transactie.informationToAccountOwner}</Text>
					<Divider />
				</Box>
			</Stack>

			<Stack mt={8}>
				<HStack justify={"space-between"}>
					<Heading5>Transactiegeschiedenis</Heading5>
					{filteredRekeninghouders.length > 0 &&
                    <IconButton size={"sm"} aria-label={"Toon transacties"} icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} onClick={() => setIsOpen(!isOpen)} />
					}
				</HStack>
				{filteredRekeninghouders.length > 0 ?
					(isOpen &&
                        <Stack ref={container}>
                        	<BanktransactiesList transacties={filteredRekeninghouders} />
                        	<Flex justify={"center"}>
                        		{(filteredRekeninghouders.length < total.current) && (
                        			<Button isLoading={isLoading} onClick={() => onClickLoadMoreButton()}>Meer transacties laden</Button>
                        		)}
                        	</Flex>
                        </Stack>
					) : (
						<Text>Er zijn geen transacties gevonden.</Text>
					)
				}
			</Stack>
		</div>
	);
};

export default BanktransactieDetailView;