import {Text, Stack, FormLabel, HStack} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import Section from "../../../shared/Section";
import SectionContainer from "../../../shared/SectionContainer";
import d from "../../../../utils/dayjs";
import { currencyFormat2 } from "../../../../utils/things";
import { PaymentExportData } from "../../../../generated/graphql";



type PaymentExportInfoSectionProps = {
	paymentExport: PaymentExportData
};

const PaymentExportInfoSection: React.FC<PaymentExportInfoSectionProps> = ({paymentExport}) => {
	const {t} = useTranslation();

	return (
        <SectionContainer>
            <Section>
                <HStack justify={"space-between"}>
                    <Stack flex={2} spacing={0}>
                        <HStack>
                            <FormLabel>{t("exports.dateCreated")}</FormLabel>
                            <Text fontSize={"sm"}>{d.unix(paymentExport.createdAt).format("L LT")}</Text>
                        </HStack>
                        <HStack>
                            <FormLabel>{t("export.totaalBedrag")}</FormLabel>
                            <Text fontSize={"sm"}>€
                                {!paymentExport?.recordsInfo?.totalAmount ? (
                                    t("exports.unknown")
                                ) : (
                                    currencyFormat2(false).format(paymentExport?.recordsInfo?.totalAmount / 100)
                                )}
                            </Text>
                        </HStack>
                        <HStack>
                            <FormLabel>{t("checksum.sha265")}</FormLabel>
                            <Text fontSize={"sm"} maxWidth={["170px", "300px", "100%"]}>{paymentExport?.file?.sha256}</Text>
                        </HStack>
                    </Stack>
                </HStack>
            </Section>
        </SectionContainer>
    );
};

export default PaymentExportInfoSection;
