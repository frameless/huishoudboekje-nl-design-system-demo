import {Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Stack, Text} from "@chakra-ui/react";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import d from "../../../utils/dayjs";
import useToaster from "../../../utils/useToaster";
import useDateValidator from "../../../validators/useDateValidator";
import {useEndAfspraakMutation, GetAfspraakDocument} from "../../../generated/graphql";

type EndAgreementViewProps = {
    onSubmit: () => void,
    startDate: Date,
    agreementId,
    endDate?: Date,
    endAfter?: Date
};

const EndAgreementView: React.FC<EndAgreementViewProps> = ({onSubmit, startDate, endDate, endAfter, agreementId}) => {
    const validator = useDateValidator();
    const {t} = useTranslation();
    const toast = useToaster();
    const [date, setDate] = useState<Date>(endDate == undefined ? d().toDate() : d(endDate).toDate());
    const [showEndDateBeforeStartDateError, setShowEndDateBeforeStartDateError] = useState<boolean>(false);

    const isValid = (): boolean => {
        try {
            const stringDate = d(date).format("YYYY-MM-DD");
            validator.parse(stringDate);

            if (endAfter != undefined) {
                return d(date) >= d(endAfter)
            }

            return true;
        }
        catch (e) {
            return false;
        }
    };

    const [endAfspraakMutation] = useEndAfspraakMutation({
        refetchQueries: [
            {query: GetAfspraakDocument, variables: {id: agreementId}}
        ],
    });

    const onSubmitEndAfspraak = (validThrough: Date) => {
        endAfspraakMutation({
            variables: {
                id: agreementId,
                validThrough: d(validThrough).format("YYYY-MM-DD"),
            },
        }).then(() => {
            toast({
                success: t("endAfspraak.successMessage", {date: d(validThrough).format("L")}),
            });
            onSubmit()
        }).catch(err => {
            toast({
                error: err.message,
            });
        });
    };

    const onClickSubmit = () => {
        if (!isValid()) {
            toast({
                error: t("errors.invalidDateError"),
            });
            return;
        }
        if (showEndDateBeforeStartDateError) {
            toast({
                error: t("errors.endDateBeforeStartDate")
            });
            return;
        }
        onSubmitEndAfspraak(date);
    };

    return (
        <Stack>
            <FormControl flex={1} isInvalid={!isValid()}>
                <FormLabel>{t("schedule.endDate")}</FormLabel>
                <DatePicker
                    selected={date && d(date).isValid() ? date : null} dateFormat={"dd-MM-yyyy"}
                    autoComplete="no"
                    aria-autocomplete="none"
                    isClearable={false}
                    selectsRange={false}
                    showYearDropdown
                    dropdownMode={"select"}
                    onChange={(value: Date) => {
                        if (value) {
                            setDate(d(value).startOf("day").toDate());
                            setShowEndDateBeforeStartDateError(d(startDate).isAfter(d(value)))
                        }
                    }}
                    customInput={<Input type={"text"} isInvalid={!isValid()} autoComplete="no" aria-autocomplete="none" />} />
                <FormErrorMessage>{t("errors.invalidDateError")}</FormErrorMessage>
                {showEndDateBeforeStartDateError === true && (<Text fontStyle={"italic"} color={"red.500"}>{t("errors.endDateBeforeStartDate")}</Text>)}

            </FormControl>

            <Flex justify={"flex-end"}>
                <Button data-test="button.endAgreement" disabled={showEndDateBeforeStartDateError} colorScheme={"primary"} onClick={onClickSubmit}>{t("global.actions.confirm")}</Button>
            </Flex>
        </Stack>
    );
};

export default EndAgreementView;
