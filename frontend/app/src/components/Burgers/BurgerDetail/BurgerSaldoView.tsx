import {Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Burger, Saldo} from "../../../generated/graphql";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import {currencyFormat2} from "../../../utils/things";


const BurgerSaldoView: React.FC<{burger: Burger}> = ({burger}) => {
    const {t} = useTranslation();

    if (burger.id == null) {
        return <SectionContainer>
            <Text>Invalid burgerId</Text>
        </SectionContainer>
    }

    return (
        <SectionContainer>
            <Section title={t("forms.burgers.sections.saldo.title")}>
                <Stack spacing={1} flex={1}>
                    <Text>{` € ${currencyFormat2(false).format(burger.saldo)}`}</Text>  
                </Stack>
            </Section>
        </SectionContainer>
    );
};

export default BurgerSaldoView;
