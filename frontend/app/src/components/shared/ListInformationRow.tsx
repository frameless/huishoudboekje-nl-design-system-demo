import {RepeatIcon} from "@chakra-ui/icons";
import {Box, Text, HStack, IconButton, Spinner} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import d from "../../utils/dayjs";

type ListInformationRowProps = {
	onUpdate: VoidFunction,
    message,
    noItemsMessage,
    total,
    timeLastUpdate,
	query,
    loading
};

const ListInformationRow: React.FC<ListInformationRowProps> = ({onUpdate, message, noItemsMessage, total, timeLastUpdate, query, loading}) => {
	const {t} = useTranslation();

	return (
        <HStack justify={"space-between"}>
            {total > 0 ? (
                <HStack>
                    <Text>{message}: </Text>
                    <Box width={100}> {loading ? <Spinner size={"xs"} /> : total}</Box>
                </HStack>
            ) : (
                <Text>{noItemsMessage}</Text>
            )}
            <HStack>
                <Text>{t("transactionsPage.timeUpdated")}: {d(timeLastUpdate).format("HH:mm:ss")}</Text>
                <IconButton
                    icon={<RepeatIcon />}
                    size={"xs"}
                    data-test="button.reload"
                    onClick={() => {
                        onUpdate();
                    }} aria-label={"reload"}
                >
                    reload
                </IconButton>
            </HStack>
        </HStack>
	);
};

export default ListInformationRow;