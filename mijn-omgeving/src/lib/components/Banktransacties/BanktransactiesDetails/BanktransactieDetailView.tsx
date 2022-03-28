import React, {useState} from "react";
import {Banktransactie, useGetBurgerQuery} from "../../../../generated/graphql";
import {ChevronDownIcon, ChevronUpIcon} from "@gemeente-denhaag/icons";
import {Box, Center, HStack, IconButton, Stack, Text} from "@chakra-ui/react";
import d from "../../../utils/dayjs";
import Divider from "@gemeente-denhaag/divider";
import PrettyIban from "../../PrettyIban";
import {currencyFormat} from "../../../utils/numberFormat";
import Queryable from "../../../utils/Queryable";
import {Heading5} from "@gemeente-denhaag/typography";
import {dateString} from "../../../utils/dateFormat";
import BackButton from "../../BackButton";
import BanktransactiesList from "../BanktransactiesList";

const BanktransactieDetailView: React.FC<{ transactie: Banktransactie, bsn: number }> = ({transactie, bsn}) => {
	const $burger = useGetBurgerQuery({
		variables: {bsn},
	});

	const [isOpen, setIsOpen] = useState<boolean>(false);

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

			<Queryable query={$burger} render={data => {
				const banktransacties: Banktransactie[] = data.burger.banktransacties || {};

				const filteredRekeninghouders = (banktransacties.filter(b => transactie.tegenrekeningIban === b.tegenrekeningIban)).filter(b => transactie.id !== b.id).sort((a, b) => {
					return (a.transactiedatum && b.transactiedatum) && a.transactiedatum < b.transactiedatum ? 1 : -1;
				});

				return (
					<Stack mt={8}>
						<HStack justify={"space-between"}>
							<Heading5>Transactiegeschiedenis</Heading5>
							{filteredRekeninghouders.length > 0 &&
                            <IconButton size={"sm"} aria-label={"Toon transacties"} icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} onClick={() => setIsOpen(!isOpen)} />
							}
						</HStack>
						{filteredRekeninghouders.length > 0 ?
							(isOpen &&
                                <BanktransactiesList transacties={filteredRekeninghouders} />
							) : (
								<Text>Er zijn geen transacties gevonden.</Text>
							)

						}
					</Stack>
				)
			}}
			/>
		</div>
	);
};

export default BanktransactieDetailView;