import {Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Burger, Saldo, useGetSaldoQuery} from "../../../generated/graphql";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import {currencyFormat2} from "../../../utils/things";
import d from "../../../utils/dayjs";
import Queryable from "../../../utils/Queryable";


const BurgerSaldoView: React.FC<{burger: Burger}> = ({burger}) => {
    const {t} = useTranslation();
    if (burger.id == null) {
        return <SectionContainer>
            <Text>Invalid burgerId</Text>
        </SectionContainer>
    }
    
    const $saldo = useGetSaldoQuery({
        variables: {
            burgers: [burger.id],
            date: d().format("YYYY-MM-DD")
        },
        fetchPolicy: "no-cache"
    })


    return (
        <Queryable query={$saldo} children={(data) => {
            const saldo: number = +data.saldo.saldo || 0;
            return (
                <SectionContainer>
                    <Section title={t("forms.burgers.sections.saldo.title")}>
                        <Stack spacing={1} flex={1}>
                            <Text>{` € ${currencyFormat2(false).format(saldo)}`}</Text>
                        </Stack>
                    </Section>
                </SectionContainer>
            )
        }}/>
    );
};

export default BurgerSaldoView;
