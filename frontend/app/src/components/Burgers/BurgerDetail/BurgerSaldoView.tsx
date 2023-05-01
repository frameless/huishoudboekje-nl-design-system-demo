import {Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Burger, Saldo, useGetSaldoClosestToQuery, useGetSaldoQuery} from "../../../generated/graphql";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import d from "../../../utils/dayjs";
import Queryable from "../../../utils/Queryable";
import {currencyFormat2} from "../../../utils/things";


const BurgerSaldoView: React.FC<{burger: Burger}> = ({burger}) => {
    const {t} = useTranslation();

    if (burger.id == null) {
        return <SectionContainer>
            <Text>Invalid burgerId</Text>
        </SectionContainer>
    }
    const $saldo = useGetSaldoQuery({
        variables: {
            burger_ids: [burger.id],
            date: d().format("YYYY-MM-DD")
        },
        fetchPolicy: "no-cache"
    })
    const $closestSaldo = useGetSaldoClosestToQuery({
        variables: {
            burger_ids: [burger.id],
            date: d().format("YYYY-MM-DD")
        },
        fetchPolicy: "no-cache"
    })

    return (
        <Queryable query={$saldo} children={(data) => {
            const saldo: Saldo[] = data.saldo || [];
            if (saldo.length > 0) {
                return (
                    <SectionContainer>
                        <Section title={t("forms.burgers.sections.saldo.title")}>
                            <Stack spacing={1} flex={1}>
                                <Text>{` € ${currencyFormat2(false).format(saldo[0].saldo)}`}</Text>
                            </Stack>
                        </Section>
                    </SectionContainer>
                )
            }
            else {
                return (
                    <Queryable query={$closestSaldo} children={(data) => {
                        const saldo: Saldo[] = data.saldoClosest || [];
                        return (
                            <SectionContainer>
                                <Section title={t("forms.burgers.sections.saldo.title")}>
                                    <Stack spacing={1} flex={1}>
                                        <Text>{saldo.length > 0 ? ` € ${currencyFormat2(false).format(saldo[0].saldo)}` : ` € ${currencyFormat2(false).format(0)}`}</Text>
                                    </Stack>
                                </Section>
                            </SectionContainer>
                        )
                    }} />
                );
            }


        }} />

    );
};

export default BurgerSaldoView;
