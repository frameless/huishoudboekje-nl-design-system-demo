import React, {useCallback, useEffect, useRef, useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import { HStack, FormControl, Text, Input, FormErrorMessage, Stack, FormLabel } from "@chakra-ui/react";
import { DateRange } from "../../../../models/models";
import _ from 'lodash';

type DateRangePickerProps = {
    onChange : (range: DateRange) => void
    intialStartDate : Date
    initialEndDate? : Date
    onCalendarOpen? : () => void
    highlightDateList? : Date[]
    clearable? : boolean
    showYearDropdown? : boolean
    customInnerComponent?: JSX.Element
    allowOnlyEndDate? : boolean
};


const DateRangePicker: React.FC<DateRangePickerProps> = ({
        onChange, 
        intialStartDate, 
        initialEndDate, 
        highlightDateList,
        onCalendarOpen,
        clearable=true, 
        showYearDropdown=true,
        customInnerComponent,
        allowOnlyEndDate=false
    }) => {

	const {t} = useTranslation(["formcomponents"]);
    const dateFormat = "dd-MM-yyyy"
    const highlightDates = highlightDateList ? [{"highlight-day": highlightDateList}] : undefined

    const [dateRange, setDateRange] = useState<DateRange>({
        from: intialStartDate,
        through: initialEndDate,
    });

    const debouncedSetDateRange = useCallback(
        _.debounce((range) => setDateRange(range), 300),
        []
      );

    useEffect(() => {
        onDateRangeChange(dateRange);
      }, [dateRange]);
      
    function onDateRangeChange(range: DateRange) {
        if(rangeIsValid(range)){
            onChange(range)
        }
    }

    function rangeIsValid(range: DateRange) {
        if(range.from === undefined && range.through === undefined || range.from === undefined && allowOnlyEndDate){
            return true
        }
        return range.from !== undefined  && (range.through === undefined || range.through >= range.from);
	}

    function onChangeStartDate(value: Date) {
        const updateValue = value ? value : undefined
        debouncedSetDateRange({from: updateValue, through: dateRange.through})
    }

    function onChangeEndDate(value: Date) {
        const updateValue = value ? value : undefined
        debouncedSetDateRange({from: dateRange.from, through: updateValue})
    }

	return (
        <Stack>
            <style>
                {`
                .highlight-day {
                    border-radius: 100%;
                    background-color: #B3D9D9;
                }
                `}
            </style>
            <FormControl isInvalid={!rangeIsValid(dateRange)}>
                <FormLabel>{t("dateRangePicker.label")}</FormLabel>
                <HStack>
                    <Stack maxWidth={"40%"} >
                        <DatePicker
                            selected={dateRange.from || null}
                            onCalendarOpen={onCalendarOpen}
                            autoComplete="no"
                            aria-autocomplete="none"
                            dateFormat={dateFormat}
                            onChange={onChangeStartDate}
                            showYearDropdown={showYearDropdown}
                            isClearable={clearable}
                            highlightDates={highlightDates}
                            dropdownMode={"select"}
                            customInput={<Input data-test="input.dateRange.start" autoComplete="no" aria-autocomplete="none" />}
                        >
                            {customInnerComponent !== undefined ?
                                customInnerComponent
                                : null
                            }
                        </DatePicker>
                    </Stack>
                    <Text maxWidth={"20%"} fontSize={"sm"}>{t("dateRangePicker.till")}</Text>
                    <Stack maxWidth={"40%"} >
                        <DatePicker
                            selected={dateRange.through || null}
                            onCalendarOpen={onCalendarOpen}
                            autoComplete="no"
                            aria-autocomplete="none"
                            dateFormat={dateFormat}
                            onChange={onChangeEndDate}
                            showYearDropdown={showYearDropdown}
                            isClearable={clearable}
                            highlightDates={highlightDates}
                            dropdownMode={"select"}
                            customInput={<Input data-test="input.dateRange.end" autoComplete="no" aria-autocomplete="none" />}
                        >
                            {customInnerComponent !== undefined ?
                                customInnerComponent
                                : null
                            }
                        </DatePicker>
                    </Stack>
                </HStack>
                <FormErrorMessage>{t("dateRangePicker.invalidEndDate")}</FormErrorMessage>
            </FormControl>
        </Stack>
	);
};

export default DateRangePicker;


