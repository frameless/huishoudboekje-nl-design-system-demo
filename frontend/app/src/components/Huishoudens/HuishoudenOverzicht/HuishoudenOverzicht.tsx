import {
    Button, Card, Flex, Spacer, Stack, Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer, Tag, useDisclosure, IconButton, Text, Box, useTheme
} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {NavLink, useLocation, useParams} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Huishouden, useGetHuishoudenQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {formatHuishoudenName} from "../../../utils/things";
import BackButton from "../../shared/BackButton";
import Page from "../../shared/Page";
import {ArrowLeftIcon, ArrowRightIcon} from "@chakra-ui/icons";



const HuishoudenOverzicht = () => {
    const {t} = useTranslation();
    const theme = useTheme();
    const {search: queryParams} = useLocation();
    const [filterHouseholdIds, setFilterHouseholdIds] = useState<string>(new URLSearchParams(queryParams).get("huishoudenId") ?? "");
    const addBurgersModal = useDisclosure();
    const $huishouden = useGetHuishoudenQuery({fetchPolicy: 'cache-and-network', variables: {id: 3}});
    const months = ['Januari', 'Februari', 'Maart']
    const tabledata = [{
        "Organisatie": "Albert Heijn",
        "Afspraken": [{
            "Omschrijving": "Loon", "Betalingen": {
                "Januari": [{"Datum": "01-01-2023", "Aantal": "15000"},
                {"Datum": "25-01-2023", "Aantal": "15000"}],
                "Februari": [{"Datum": "01-02-2023", "Aantal": "16000"},
                {"Datum": "25-02-2023", "Aantal": "16000"},
                {"Datum": "25-02-2023", "Aantal": "16000"}],
                "Maart": [{"Datum": "01-03-2023", "Aantal": "17000"},
                {"Datum": "25-03-2023", "Aantal": "17000"}, {"Datum": "25-03-2023", "Aantal": "17000"}],
            }
        }]
    },
    {
        "Organisatie": "Eneco",
        "Afspraken": [{
            "Omschrijving": "Energie Kosten", "Betalingen": {
                "Januari": [{"Datum": "01-01-2023", "Aantal": "-15000"},
                {"Datum": "15-01-2023", "Aantal": "-15000"},
                {"Datum": "25-01-2023", "Aantal": "-15000"}],
                "Februari": [{"Datum": "01-02-2023", "Aantal": "-15000"},
                {"Datum": "15-02-2023", "Aantal": "-15000"},
                {"Datum": "25-02-2023", "Aantal": "-15000"}],
                "Maart": [{"Datum": "01-03-2023", "Aantal": "-15000"},
                {"Datum": "25-03-2023", "Aantal": "-15000"}],
            }
        },
        {
            "Omschrijving": "Toeslagen Korting", "Betalingen": {
                "Januari": [{"Datum": "01-01-2023", "Aantal": "5000"}, {"Datum": "01-01-2023", "Aantal": "5000"}],
                "Februari": [{"Datum": "01-02-2023", "Aantal": "2000"},
                {"Datum": "01-02-2023", "Aantal": "3000"}],
                "Maart": [{"Datum": "01-02-2023", "Aantal": "2000"}],
            }
        }]
    }
    ]

    function getRowspanForOrganisation(organisationData) {
        let maxRowSpan = 0;
        for (const afspraak of organisationData.Afspraken) {
            maxRowSpan += getRowspanForAfspraak(afspraak)
        }

        return maxRowSpan
    }

    function getRowspanForAfspraak(afspraakData) {
        let maxAfspraakRowSpan = 0
        for (const key in afspraakData.Betalingen) {
            const paymentCount = afspraakData.Betalingen[key].length
            if (maxAfspraakRowSpan < paymentCount) {
                maxAfspraakRowSpan = paymentCount
            }
        }
        return maxAfspraakRowSpan
    }

    function getPaymentAmountOrEmpty(payments, index) {
        if (payments.length > index) {
            return payments[index].Aantal
        }
        else {
            return ""
        }
    }

    function getCorrectDividerClass(isLastInAgreements, isLastInOrganisations) {
        if (isLastInAgreements || isLastInOrganisations) {
            return "divider-light"
        }
        return ""
    }

    function stylePaymentRow(paymentAmount, isLastInAgreements, isLastInOrganisations) {
        const classes = getCorrectDividerClass(isLastInAgreements, isLastInOrganisations)
        return <Td textAlign={"right"} className={classes}>{paymentAmount}</Td>
    }

    function getPaymentRowWithStyling(payments, index, isLastInAgreements, isLastInOrganisations) {
        const paymentRow: JSX.Element[] = []
        paymentRow.push(stylePaymentRow(getPaymentAmountOrEmpty(payments.Januari, index), isLastInAgreements, isLastInOrganisations))
        paymentRow.push(stylePaymentRow(getPaymentAmountOrEmpty(payments.Februari, index), isLastInAgreements, isLastInOrganisations))
        paymentRow.push(stylePaymentRow(getPaymentAmountOrEmpty(payments.Maart, index), isLastInAgreements, isLastInOrganisations))

        return paymentRow;
    }


    return (
        <Queryable query={$huishouden} children={data => {

            const huishouden: Huishouden = data.huishouden;
            const burgerIds: string[] = (huishouden.burgers || []).map(b => String(b.id));


            // HTML is dymanically generated here because of JSX limitations. For the use of rowSpan it is necesary that the next <Tr> is defined with only the not-yet-filled
            // columns in the row. This EXCLUDES rows that are filled by rowSpan. This is not an issue if a <Tr> could be dynamically closed. Unfortunately, this is not possible.
            // A <Tr> requires a </Tr> in the same scope, it is not possible to close it dynamically when needed (with say an if statement). So every row has to be dynamically generated
            // based on it's conditions instead... This goes for inline-ts/html and for pushing <Tr>'s into an array. That said, why start generating all the way at the payment section:
            // The conditions are such that if a payment is the first of an agreement, this requires a new agreement column. The same for agreements and organisations
            function renderTableRows(data) {
                const tableRows: any[] = []
                for (const [organisatieKey, organisatie] of data.entries()) {
                    const organisatieRowspan = getRowspanForOrganisation(organisatie)
                    const organisatieRowColor = organisatieKey % 2 === 0 ? "white" : "uneven-row"
                    for (const [afspraakKey, afspraak] of organisatie.Afspraken.entries()) {
                        const afspraakRowspan = getRowspanForAfspraak(afspraak)
                        const isLastAgreementInOrganisation = afspraakKey + 1 == organisatie.Afspraken.length
                        for (let betalingIndex = 0; betalingIndex < afspraakRowspan; betalingIndex++) {
                            const isLastBetalingInAgreement = betalingIndex === (afspraakRowspan - 1);
                            const isLastBetalingInOrganisation = isLastBetalingInAgreement && isLastAgreementInOrganisation
                            const paymentRow = getPaymentRowWithStyling(afspraak.Betalingen, betalingIndex, isLastBetalingInAgreement, isLastBetalingInOrganisation)
                            // First payment && first agreement means we have reached a new organisation and must render the entire row
                            if (afspraakKey === 0 && betalingIndex === 0) {
                                tableRows.push(
                                    <Tr className={organisatieRowColor}>
                                        <Td textAlign={"left"} verticalAlign={"top"} padding={5} rowSpan={organisatieRowspan} fontWeight={"bold"} className="divider-light">{organisatie.Organisatie}</Td>
                                        <Td textAlign={"left"} verticalAlign={"top"} padding={5} rowSpan={afspraakRowspan} className={getCorrectDividerClass(true, isLastAgreementInOrganisation)}>{afspraak.Omschrijving}</Td>
                                        <Td textAlign={"left"} verticalAlign={"top"} padding={5} rowSpan={afspraakRowspan} className={getCorrectDividerClass(true, isLastAgreementInOrganisation)}></Td>
                                        {paymentRow}
                                        <Td textAlign={"left"} verticalAlign={"top"} padding={5} rowSpan={afspraakRowspan} className={getCorrectDividerClass(true, isLastAgreementInOrganisation)}></Td>
                                    </Tr>
                                )
                            }
                            // If this is not the first agreement, but it is the first of an agreement section we must render the agreement column in the row
                            else if (betalingIndex === 0) {
                                tableRows.push(
                                    <Tr className={organisatieRowColor}>
                                        <Td textAlign={"left"} verticalAlign={"top"} padding={5} rowSpan={afspraakRowspan} className={getCorrectDividerClass(true, isLastAgreementInOrganisation)}>{afspraak.Omschrijving}</Td>
                                        <Td rowSpan={afspraakRowspan} className={getCorrectDividerClass(true, isLastAgreementInOrganisation)}></Td>
                                        {paymentRow}
                                        <Td rowSpan={afspraakRowspan} className={getCorrectDividerClass(true, isLastAgreementInOrganisation)}></Td>
                                    </Tr>
                                )
                            }
                            // if it's not the first payment in an agreement section, and also not the first agreement in the organisation
                            else {
                                tableRows.push(
                                    <Tr className={organisatieRowColor}>
                                        {paymentRow}
                                    </Tr>
                                )
                            }
                        }
                    }
                }
                return tableRows
            }


            return (
                <Page title={t("huishoudenName", {name: formatHuishoudenName(huishouden)})} backButton={(<BackButton to={AppRoutes.Huishoudens()} />)} right={(
                    <Button size={"sm"} variant={"outline"} colorScheme={"primary"} as={NavLink} to={AppRoutes.RapportageBurger([...burgerIds])}>{t("global.actions.showReports")}</Button>
                )}>
                    <Card w={'100%'}>
                        <TableContainer>
                            <Table variant="unstyled" className="table-overzicht">
                                <Thead>
                                    <Tr>
                                        <Th textAlign={"left"}>Organisatie </Th>
                                        <Th textAlign={"left"}>Afspraak</Th>
                                        <Th className="small"><IconButton aria-label="move left" icon={<ArrowLeftIcon />}></IconButton></Th>
                                        <Th textAlign={"right"}>Januari</Th>
                                        <Th textAlign={"right"}>Februari</Th>
                                        <Th textAlign={"right"}>Maart</Th>
                                        <Th className="small"><IconButton aria-label="move right" icon={<ArrowRightIcon />}></IconButton></Th>
                                    </Tr>
                                </Thead>
                                <Tbody >
                                    {renderTableRows(tabledata)}
                                    <Tr className="divider-dark-top">
                                        <Td className="divider-light">Eindsaldo</Td>
                                        <Td className="divider-light"></Td>
                                        <Td className="divider-light"></Td>
                                        <Td className="divider-light" textAlign={"right"}>1000</Td>
                                        <Td className="divider-light" textAlign={"right"}>1000</Td>
                                        <Td className="divider-light" textAlign={"right"}>1000</Td>
                                        <Td className="divider-light"></Td>
                                    </Tr>
                                    <Tr className="divider-light" >
                                        <Td className="divider-light" >Saldo Mutatie</Td>
                                        <Td className="divider-light" ></Td>
                                        <Td className="divider-light" ></Td>
                                        <Td className="divider-light" textAlign={"right"}>1000</Td>
                                        <Td className="divider-light" textAlign={"right"}>1000</Td>
                                        <Td className="divider-light" textAlign={"right"}>1000</Td>
                                        <Td className="divider-light"></Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Page >
            );
        }} />
    );
};

export default HuishoudenOverzicht;