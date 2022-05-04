import React from "react";
import {Afspraak, useGetBurgerQuery} from "../../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {Table, Tbody, Td, Text, Th, Thead, Tr} from "@chakra-ui/react";
import {Heading2} from "@gemeente-denhaag/typography";
import {currencyFormat2} from "../../utils/numberFormat";
import BackButton from "../BackButton";


const AfsprakenView: React.FC<{ bsn: number }> = ({bsn}) => {
    const $burger = useGetBurgerQuery({
        variables: {bsn},
    });

    return (
        <div>
            <BackButton label={"Huishoudboekje"} />
            <Heading2>Afspraken</Heading2>

            <Queryable query={$burger} render={data => {
                const {afspraken = []} = data.burger || {};

                return (
                    <div>
                        <Text fontSize={"xl"} mt={10}>Inkomsten</Text>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th color={"gray.400"}>Tegenpartij</Th>
                                    <Th color={"gray.400"}>Omschrijving</Th>
                                    <Th color={"gray.400"} isNumeric>Bedrag</Th>
                                </Tr>
                            </Thead>
                            {afspraken.filter(afspraken => afspraken.credit).map((afspraak: Afspraak, i) => {
                                return (
                                    <Tbody key={i}>
                                        <Tr key={i}>
                                            {/*<Td>*/}
                                            {/*    <pre>{JSON.stringify(afspraak.tegenrekening?.afdelingen?.[0].organisatie?.naam, null, 2)}</pre>*/}
                                            {/*</Td>*/}
                                            <Td>{afspraak.tegenrekening?.afdelingen?.[0]?.organisatie?.naam || afspraak.tegenrekening?.rekeninghouder} </Td>
                                            <Td>{afspraak.omschrijving}</Td>
                                            <Td isNumeric>{afspraak.bedrag && currencyFormat2(true).format((parseInt(afspraak.bedrag) / 100) * (afspraak.credit ? 1 : -1))}</Td>
                                        </Tr>
                                    </Tbody>
                                )
                            })}
                        </Table>

                        <Text fontSize={"xl"} mt={10}>Uitgaven</Text>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th color={"gray.400"}>Tegenpartij</Th>
                                    <Th color={"gray.400"}>Omschrijving</Th>
                                    <Th color={"gray.400"} isNumeric>Bedrag</Th>
                                </Tr>
                            </Thead>
                            {afspraken.filter(afspraken => afspraken.credit === false).map((afspraak: Afspraak, i) => {
                                return (
                                    <Tbody key={i}>
                                        <Tr key={i}>
                                            {/*<Td>*/}
                                            {/*    <pre>{JSON.stringify(afspraak.tegenrekening?.afdelingen?.[0], null, 2)}</pre>*/}
                                            {/*</Td>*/}
                                            <Td>{afspraak.tegenrekening?.afdelingen?.[0]?.organisatie?.naam || afspraak.tegenrekening?.rekeninghouder} </Td>
                                            <Td>{afspraak.omschrijving}</Td>
                                            <Td isNumeric>{afspraak.bedrag && currencyFormat2(true).format((parseInt(afspraak.bedrag) / 100) * (afspraak.credit ? 1 : -1))}</Td>
                                        </Tr>
                                    </Tbody>
                                )
                            })}
                        </Table>
                    </div>
                )
            }} />
        </div>
    );
};

export default AfsprakenView;