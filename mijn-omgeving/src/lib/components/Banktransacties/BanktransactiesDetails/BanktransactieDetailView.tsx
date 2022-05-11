import {Box, Center, HStack, IconButton, Stack, Text} from "@chakra-ui/react";
import {Heading5} from "@gemeente-denhaag/components-react";
import Divider from "@gemeente-denhaag/divider";
import {ChevronDownIcon, ChevronUpIcon} from "@gemeente-denhaag/icons";
import d from "dayjs";
import React, {useRef, useState} from "react";
import {Banktransactie, useGetBanktransactiesForAfspraakQuery} from "../../../../generated/graphql";
import {dateString} from "../../../utils/dateFormat";
import {currencyFormat} from "../../../utils/numberFormat";
import Queryable from "../../../utils/Queryable";
import BackButton from "../../BackButton";
import PrettyIban from "../../PrettyIban";
import BanktransactiesList from "../BanktransactiesList";

const BanktransactieDetailView: React.FC<{ transactie: Banktransactie, bsn: number }> = ({transactie, bsn}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const container = useRef<HTMLDivElement>(null);
    const $transacties = useGetBanktransactiesForAfspraakQuery({
        variables: {
            bsn,
            afspraakId: transactie.journaalpost?.afspraak?.id!,
        },
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

            <Queryable query={$transacties} render={data => {
                const transacties: Banktransactie[] = [];
                const journaalposten = data.burger?.afspraak?.journaalposten;

                if (journaalposten) {
                    journaalposten.forEach(j => {
                        if (j.banktransactie) {
                            transacties.push(j.banktransactie);
                        }
                    });
                }

                if (transacties.length === 0) {
                    return null;
                }

                return (
                    <Stack mt={8}>
                        <HStack justify={"space-between"}>
                            <Heading5>Transactiegeschiedenis</Heading5>
                            <IconButton size={"sm"} aria-label={"Toon transacties"} icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} onClick={() => setIsOpen(!isOpen)} />
                        </HStack>
                        {isOpen &&
                        <Stack ref={container}>
                            <BanktransactiesList transacties={transacties} />
                        </Stack>
                        }
                    </Stack>
                );
            }} />
        </div>
    );
};

export default BanktransactieDetailView;