import {Checkbox, CheckboxGroup, FormControl, FormLabel, Stack, Text} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Burger, Saldo, Signaal, useGetSaldoClosestToQuery, useGetSaldoQuery} from "../../../generated/graphql";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import SignalenListView from "../../Signalen/SignalenListView";
import d from "../../../utils/dayjs";
import Queryable from "../../../utils/Queryable";


const BurgerSaldoView: React.FC<{burger: Burger}> = ({burger}) => {
    const {t} = useTranslation();

    const $saldo = useGetSaldoQuery({
        variables: {
            burger_ids: [burger.id ?? -1],
            date: d().format("YYYY-MM-DD")
        },
    })

    const $closestSaldo = useGetSaldoClosestToQuery({
        variables: {
            burger_ids: [burger.id ?? -1],
            date: d().format("YYYY-MM-DD")
        }
    })

    return (
        <Queryable query={$saldo} children={(data) => {
            const saldo: Saldo[] = data.saldo || [];
            if (saldo.length > 0) {
                return (
                    <SectionContainer>
                        <Section title={t("forms.burgers.sections.saldo.title")}>
                            <Stack spacing={1} flex={1}>
                                <FormLabel>{t("forms.burgers.sections.saldo.title")}</FormLabel>
                                <Text>{saldo[0].saldo}</Text>
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
                                        <FormLabel>{t("forms.burgers.sections.saldo.title")}</FormLabel>
                                        <Text>{saldo.length > 0 ? saldo[0].saldo : t("forms.burgers.sections.saldo.noSaldo")}</Text>
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
