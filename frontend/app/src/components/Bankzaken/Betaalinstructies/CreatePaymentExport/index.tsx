
import {Alert, AlertIcon, Box, Button, Checkbox, FormControl, FormErrorMessage, FormLabel, HStack, Input, Skeleton, Stack, Text, useTheme} from "@chakra-ui/react";
import {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import {GetPaymentRecordsByIdDocument, useGetNotExportedPaymentRecordsByIdLazyQuery, usePaymentRecordService_CreatePaymentRecordsMutation} from "../../../../generated/graphql";
import {DateRange} from "../../../../models/models";
import d from "../../../../utils/dayjs";
import Page from "../../../shared/Page";
import Section from "../../../shared/Section";
import SectionContainer from "../../../shared/SectionContainer";
import {getUnixTimestampFromDate} from "../../../../utils/things";
import PaymentRecordList from "./PaymentRecordList";
import dayjs from "../../../../utils/dayjs";
import DateRangePicker from "./DateRangePicker";
import SelectedRecordsWrapper from "./SelectedRecordsWrapper";



const CreateBetaalinstructies = () => {
    const {t} = useTranslation(["paymentrecords"]);
    const theme = useTheme();

    const [dateRange, setDateRange] = useState<DateRange>({
        from: d().startOf("day").toDate(),
        through: d().startOf("day").toDate(),
    });

    function changeDateRange(from, through) {
        setDateRange({from: from, through: through})
        if (from !== null && through !== null && from !== undefined && through !== undefined) {
            paymentRecordServiceCreatePaymentRecordsMutation({
                variables: {
                    from: getUnixTimestampFromDate(from),
                    to: getUnixTimestampFromDate(through),
                    processAt: useCustomPaymentDate == true && paymentDate != undefined ? getUnixTimestampFromDate(paymentDate) : null
                },
                refetchQueries: [
                    {query: GetPaymentRecordsByIdDocument}
                ]
            })
            $notExportedRecords()
        }
    }

    const [$notExportedRecords, notExportedRecords] = useGetNotExportedPaymentRecordsByIdLazyQuery({fetchPolicy: "network-only"})
    const [useCustomPaymentDate, setUseCustomPaymentDate] = useState<boolean>(false)

    const onChangeUseCustomPaymentDate = (value: boolean) => {
        setUseCustomPaymentDate(value)
        if (dateRange.from != null && dateRange.through != null && paymentDate != null) {
            paymentRecordServiceCreatePaymentRecordsMutation({
                variables: {
                    from: getUnixTimestampFromDate(dateRange.from),
                    to: getUnixTimestampFromDate(dateRange.through),
                    processAt: value == true && paymentDate != undefined ? getUnixTimestampFromDate(paymentDate) : null
                },
                refetchQueries: [
                    {query: GetPaymentRecordsByIdDocument}
                ]
            })
            resetUpdatePaymentRecordCache()
            $notExportedRecords()
        }
    }

    const [paymentDate, setPaymentDate] = useState<Date | undefined>(undefined)
    const onChangePaymentDate = (value: Date | undefined) => {
        setPaymentDate(value)
        if (dateRange.from != null && dateRange.through != null) {
            paymentRecordServiceCreatePaymentRecordsMutation({
                variables: {
                    from: getUnixTimestampFromDate(dateRange.from),
                    to: getUnixTimestampFromDate(dateRange.through),
                    processAt: useCustomPaymentDate == true && value != undefined ? getUnixTimestampFromDate(value) : null
                }
            })
            resetUpdatePaymentRecordCache()
            $notExportedRecords()
        }
    }

    const validateCustomPaymentDate = (value: Date | undefined, range: DateRange | null = null) => {
        const {from, through} = range !== null && range !== undefined ? range : dateRange
        if (value !== undefined) {
            const maxPastDate = d().subtract(7, "days").startOf("day");
            if (d(value).isSameOrAfter(maxPastDate) && d(value).isSameOrBefore(d(through).add(7, "days").endOf("day"))) {
                setPaymentDateValid(true)
                return true
            }
        }
        if (value === undefined && !useCustomPaymentDate) {
            setPaymentDateValid(true)
            return true
        }
        setPaymentDateValid(false)
        return false
    }

    const [paymentDateValid, setPaymentDateValid] = useState<boolean>(true)

    const [paymentRecordServiceCreatePaymentRecordsMutation, {data, loading, error, called}] = usePaymentRecordService_CreatePaymentRecordsMutation({context: {debounceKey: "createPaymentInstructions"}})
    const initialState: string[] = []
    const [paymentRecordsCacheTracker, setPaymentRecordsCacheTracker] = useState(initialState)
    function updatePaymentRecordsCacheTracker(value) {
        const newArray = paymentRecordsCacheTracker.filter((val) => true)
        newArray.push(value);
        setPaymentRecordsCacheTracker(newArray)
    }

    function resetUpdatePaymentRecordCache() {
        setPaymentRecordsCacheTracker([])
    }

    if (!called) {
        paymentRecordServiceCreatePaymentRecordsMutation({
            variables: {
                from: getUnixTimestampFromDate(dateRange.from),
                to: getUnixTimestampFromDate(dateRange.through),
                processAt: useCustomPaymentDate ? getUnixTimestampFromDate(paymentDate) : null
            }
        })
        $notExportedRecords()
    }

    let notExportedInTheLastWeek = 0;
    function getNotExportedRecordDates() {
        if (notExportedRecords.data == undefined || notExportedRecords.data == null) {
            return []
        }
        const dates: Date[] = [];
        let inLastWeek = 0;
        notExportedRecords.data.PaymentRecordService_GetNotExportedPaymentRecordDates?.data?.forEach(element => {
            const date = dayjs.unix(element.date).toDate();
            if (dateRange.from != undefined && dateRange.from != null && dateRange.through != undefined && dateRange.through != null) {
                if (dateRange.from > date || dateRange.through < date) {
                    dates.push(date);
                    if (d(dateRange.from).subtract(7, 'days').toDate() <= date && date < dateRange.from) {
                        inLastWeek += 1;
                    }
                }
            }
            else {
                dates.push(date)
            }
        });

        notExportedInTheLastWeek = inLastWeek;

        return dates;
    }

    function onDateRangeChange(range: DateRange) {
        if (range) {
            validateCustomPaymentDate(paymentDate, range)
            changeDateRange(range.from, range.through)
        }
    }

    return (
        <Page title={t("creationPage.addSection")}>
            <SectionContainer>
                <Section>
                    <HStack>

                        <Stack w={"100%"} spacing={1} verticalAlign={"center"}>
                            <Stack w={"40%"} direction={["column", "row"]} alignItems={"flex-end"}>
                                <FormControl flex={1}>
                                    <DateRangePicker
                                        onChange={onDateRangeChange}
                                        intialStartDate={d().startOf("day").toDate()}
                                        initialEndDate={d().endOf("day").toDate()}
                                        highlightDateList={getNotExportedRecordDates()}
                                        showYearDropdown={false}
                                        customInnerComponent={<Text fontStyle={"italic"}>* {t("creationPage.highlightedDateText")}</Text>} />
                                </FormControl>
                            </Stack>
                            {notExportedInTheLastWeek > 0 &&
                                <Box alignContent={"start"} w={"100%"}>
                                    <Alert fontSize={"medium"} fontStyle={"italic"} backgroundColor={"transparent"} size={"sm"} status={"info"}><AlertIcon></AlertIcon>
                                        {t("creationPage.openRecordsAlert", {"amount": notExportedInTheLastWeek})}
                                    </Alert>
                                </Box>
                            }

                            <Checkbox onChange={e => {
                                onChangeUseCustomPaymentDate(e.target.checked ?? false)
                            }} flex={1}>{t("creationPage.useCustomPaymentDate")}</Checkbox>
                            {useCustomPaymentDate && (
                                <Stack>
                                    <FormControl flex={1} isInvalid={!paymentDateValid}>
                                        <FormLabel>{t("creationPage.paymentDate")}</FormLabel>
                                        <DatePicker
                                            autoComplete="no"
                                            aria-autocomplete="none"
                                            dateFormat={"dd-MM-yyyy"}
                                            isClearable={false}
                                            selected={paymentDate}
                                            selectsRange={false}
                                            showYearDropdown
                                            dropdownMode={"select"}
                                            onChange={value => {
                                                const date = value === null ? undefined : value
                                                validateCustomPaymentDate(date)
                                                onChangePaymentDate(date)
                                            }}
                                            customInput={<Input autoComplete="no" aria-autocomplete="none" />}
                                        />
                                        <FormErrorMessage>{t("creationPage.invalidPaymentDate", {"startDate": d().subtract(7, "days").format("L"), "endDate": d(dateRange.through).add(7, "days").format("L")})}</FormErrorMessage>
                                    </FormControl>
                                    <FormLabel>{t("creationPage.customPaymentInformation")}</FormLabel>
                                </Stack>
                            )}
                        </Stack>
                    </HStack>
                </Section>
            </SectionContainer>
            <SectionContainer>
                {loading &&
                    <>
                        <Skeleton data-test="skeleton" h={5} w={"100%"} marginBottom={2}></Skeleton>
                        <Skeleton h={5} w={"100%"} marginBottom={2}></Skeleton>
                        <Skeleton h={5} w={"100%"} marginBottom={2}></Skeleton>
                    </>
                }
                {data != undefined && data?.PaymentRecordService_CreatePaymentRecords?.count != undefined && data?.PaymentRecordService_CreatePaymentRecords.count > 0 &&
                    <Section>
                        <SelectedRecordsWrapper startDate={getUnixTimestampFromDate(dateRange.from)} inCache={paymentRecordsCacheTracker} updateInCache={updatePaymentRecordsCacheTracker} loading={loading} endDate={getUnixTimestampFromDate(dateRange.through)} paymentRecords={data?.PaymentRecordService_CreatePaymentRecords?.data} count={data?.PaymentRecordService_CreatePaymentRecords?.count} />
                    </Section>
                }
                {data != undefined && data?.PaymentRecordService_CreatePaymentRecords?.count == undefined &&
                    <Section>
                        <Text>{t("creationPage.noInstructionFound")}</Text>
                    </Section>
                }
            </SectionContainer>

        </Page >
    );
};

export default CreateBetaalinstructies;
