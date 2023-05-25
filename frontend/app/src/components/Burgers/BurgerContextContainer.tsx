import { FormLabel, Stack, Tag, TagLabel, TagLeftIcon, Text } from "@chakra-ui/react";
import { Burger } from "../../generated/graphql";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import { WarningTwoIcon } from "@chakra-ui/icons";
import {useTranslation} from "react-i18next";
import { getBurgerHhbId } from "../../utils/things";

const BurgerContextContainer = (data : {burger : Burger | undefined}) => {
	const {t} = useTranslation();
    const burgerAvailable = data.burger !== undefined
        && data.burger.voorletters !== undefined
        && data.burger.voornamen !== undefined
        && data.burger.achternaam !== undefined
        && data.burger.id !== undefined
        
    const burger : Burger = (data.burger as Burger)
	return (
        <SectionContainer>
            <Section title={t("burgers.context.title")}>
                {
                    burgerAvailable ? 
                        <Stack>
                            <Stack spacing={2} mb={1} direction={["column", "row"]}>
                                <Stack spacing={1} flex={1}>
                                    <FormLabel>{t("forms.burgers.fields.hhbId")}</FormLabel>
                                    <Text>{getBurgerHhbId(burger)}</Text>
                                </Stack>
                            </Stack>
                            <Stack spacing={2} mb={1} direction={["column", "row"]}>
                                <Stack direction={["column", "row"]} spacing={1} flex={1}>
                                    <Stack spacing={1} flex={1}>
                                        <FormLabel>{t("forms.burgers.fields.initials")}</FormLabel>
                                        <Text>{burger.voorletters}</Text>
                                    </Stack>
                                    <Stack spacing={1} flex={1}>
                                        <FormLabel>{t("forms.burgers.fields.firstName")}</FormLabel>
                                        <Text>{burger.voornamen}</Text>
                                    </Stack>
                                </Stack>
                                <Stack spacing={1} flex={1}>
                                    <FormLabel>{t("forms.burgers.fields.lastName")}</FormLabel>
                                    <Text>{burger.achternaam}</Text>
                                </Stack>
                            </Stack>
                        </Stack>
                        :
                        <Tag size={"lg"} key={"lg"} variant={"subtle"} colorScheme={"red"}>
                            <TagLeftIcon boxSize='12px' as={WarningTwoIcon} />
                            <TagLabel>{t("burgers.context.noBurger")}</TagLabel>
                        </Tag>
                }
            </Section>
        </SectionContainer>
	);
};

export default BurgerContextContainer;