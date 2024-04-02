import {
    Card,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer, IconButton, Box, VStack, Spinner
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom";
import {Burger, GetHuishoudenOverzichtDocument, useGetHuishoudenOverzichtLazyQuery, useGetHuishoudenOverzichtQuery} from "../../../generated/graphql";
import Queryable, {Loading} from "../../../utils/Queryable";
import {currencyFormat2} from "../../../utils/things";
import {ArrowLeftIcon, ArrowRightIcon} from "@chakra-ui/icons";
import d from "../../../utils/dayjs";
import {formatTableData, getMonthsBetween, getMonthName} from "./TableDataFormatter";
import {DateRange} from "../../../models/models";
import HuishoudenOverzichtTable from "./HuishoudenOverzichtTable";
import {useLazyQuery, useQuery} from "@apollo/client";


type BalanceTableProps = {burgerIds: number[], burgers: Burger[], dateRange: DateRange, changeDateCallback: Function};

const HuishoudenOverzicht: React.FC<BalanceTableProps> = ({burgerIds, burgers, dateRange, changeDateCallback}) => {
    const {t} = useTranslation();
    const {loading, error, data} = useQuery(GetHuishoudenOverzichtDocument, {variables: {burgers: burgerIds, start: d(dateRange.from).format('YYYY-MM-DD'), end: d(dateRange.through).format('YYYY-MM-DD')}, fetchPolicy: "cache-and-network"})
    const months = getMonthsBetween(d(dateRange.from).format('YYYY-MM-DD'), d(dateRange.through).format('YYYY-MM-DD'))
    let columnCount = 1

    function getFormattedData(data) {
        const formatted = formatTableData(data.overzicht.afspraken, d(dateRange.from).startOf('month').format('YYYY-MM-DD'), d(dateRange.through).endOf('month').format('YYYY-MM-DD'))
        columnCount = formatted.length
        return formatted
    }
    return (
        <Card w={'100%'}>
            <TableContainer>
                <Table variant="unstyled" className="table-overzicht">
                    <Thead>
                        <Tr>
                            <Th w={"27.5%!important"} maxW={"27.5%!important"} minW={"27.5%!important"} textAlign={"left"}>{t("overzicht.tegenrekening")}</Th>
                            <Th w={"27.5%!important"} maxW={"27.5%!important"} minW={"27.5%!important"} textAlign={"left"}>{t("overzicht.afspraak")}</Th>
                            <Th w={"3.75%!important"} maxW={"3.75%!important"} className="small"><IconButton aria-label="move left" onClick={(value) => changeDateCallback(1)} icon={<ArrowLeftIcon />}></IconButton></Th>
                            <Th w={"12.5%!important"} maxW={"12.5%!important"} textAlign={"right"}><VStack><Box>{months[0].name}</Box><Box fontWeight={"semibold"}>{months[0].year}</Box></VStack></Th>
                            <Th w={"12.5%!important"} maxW={"12.5%!important"} textAlign={"right"}><VStack><Box>{months[1].name}</Box><Box fontWeight={"semibold"}>{months[1].year}</Box></VStack></Th>
                            <Th w={"12.5%!important"} maxW={"12.5%!important"} textAlign={"right"}><VStack><Box>{months[2].name}</Box><Box fontWeight={"semibold"}>{months[2].year}</Box></VStack></Th>
                            <Th w={"3.75%!important"} maxW={"3.75%!important"} className="small"><IconButton aria-label="move right" onClick={(value) => changeDateCallback(-1)} icon={<ArrowRightIcon />}></IconButton></Th>
                        </Tr>
                    </Thead>
                    {!loading &&
                        < HuishoudenOverzichtTable
                            afspraken={getFormattedData(data)}
                            saldos={data.overzicht.saldos}
                            burgers={burgers}
                            months={months} />
                    }
                    {loading &&
                        <Tbody>
                            <Tr>
                                <Td />
                                <Td />
                                <Td>
                                    <Box>
                                        <Spinner
                                            thickness='4px'
                                            speed='0.65s'
                                            emptyColor='gray.200'
                                            color='blue.500'
                                            size="xl"
                                        />
                                    </Box>
                                </Td>
                                <Td />
                                <Td />
                                <Td />
                            </Tr>
                        </Tbody>
                    }
                </Table>
            </TableContainer>
        </Card>
    );



}

export default HuishoudenOverzicht;