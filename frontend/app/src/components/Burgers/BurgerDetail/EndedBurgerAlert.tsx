import {Alert, AlertDescription, AlertIcon, AlertTitle, Box, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Burger} from "../../../generated/graphql";
import d from "../../../utils/dayjs";

const EndedBurgerAlert: React.FC<{burger: Burger}> = ({burger}) => {
	const {t} = useTranslation();

    const date = d(burger.endDate, "YYYY-MM-DD")
    const isActive = d().endOf("day").isSameOrBefore(date.endOf("day"))
    const translationKey = isActive ? "messages.burgers.willEndOn" : "messages.burgers.endedOn"
	return (
            <Alert status={"info"} colorScheme={"skyblue"}>
                <AlertIcon />
                <AlertTitle mr={2}>
                    {t(translationKey, {enddate: date.format("L")})}
                </AlertTitle>
                <AlertDescription>
                </AlertDescription>
            </Alert>);
};

export default EndedBurgerAlert;