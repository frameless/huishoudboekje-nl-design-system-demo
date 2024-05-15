import {DownloadIcon} from "@chakra-ui/icons";
import {Box, Button, Checkbox, FormControl, FormErrorMessage, FormLabel, HStack, Input, Stack, Text, useBreakpointValue} from "@chakra-ui/react";
import {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import {AppRoutes} from "../../../config/routes";
import {Export, useCreateExportOverschrijvingenMutation, useGetExportsPagedQuery} from "../../../generated/graphql";
import {DateRange} from "../../../models/models";
import d from "../../../utils/dayjs";
import Queryable, { Loading } from "../../../utils/Queryable";
import useHandleMutation from "../../../utils/useHandleMutation";
import Page from "../../shared/Page";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import {MathOperation, currencyFormat2, floatMathOperation} from "../../../utils/things";
import usePagination from "../../../utils/usePagination";

const Betaalinstructies = () => {
	const {t} = useTranslation();
	const handleMutation = useHandleMutation();
	const [isLoading, setIsLoading] = useState(true);
    const onPaginationClick = () => {
        setIsLoading(true)
    }
	const {offset, total, pageSize, setTotal, goFirst, PaginationButtons} = usePagination({pageSize: 10}, onPaginationClick);
	const $exports = useGetExportsPagedQuery({
		fetchPolicy: "no-cache",
		variables: {
			offset: offset <= 1 ? 0 : offset,
			limit: pageSize,
		},
        onCompleted: () => {
			setIsLoading(false)
		},
	});
	const isMobile = useBreakpointValue([true, null, null, false]);
	const [createExportOverschrijvingen, $createExportOverschrijvingen] = useCreateExportOverschrijvingenMutation(
		{onCompleted: () =>{
			goFirst()
			$exports.refetch().then(() => {setIsLoading(false)})
		}
	});

	const [dateRange, setDateRange] = useState<DateRange>({
		from: d().startOf("day").toDate(),
		through: d().endOf("day").toDate(),
	});


	const [useCustomPaymentDate, setUseCustomPaymentDate] = useState<boolean>(false)

	const onChangeUseCustomPaymentDate = (value: boolean) => {
		setUseCustomPaymentDate(value)
	}

	const [paymentDate, setPaymentDate] = useState<Date | undefined>(undefined)
	const onChangePaymentDate = (value: Date | undefined) => {
		setPaymentDate(value)
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

	const onClickExportButton = () => {
		const payment_date = useCustomPaymentDate ? d(paymentDate).format("YYYY-MM-DD") : undefined
		handleMutation(createExportOverschrijvingen({
			variables: {
				startDatum: d(dateRange.from).format("YYYY-MM-DD"),
				eindDatum: d(dateRange.through).format("YYYY-MM-DD"),
				verwerkingDatum: payment_date
			},
		}), t("messages.exports.createSuccessMessage"));
	};

	const onChangeStartDate = (value: [Date, Date]) => {
		const [from, through] = value;

		if (value) {
			setDateRange(() => ({
				from, through,
			}));
			validateCustomPaymentDate(paymentDate, {from, through})
		}

	};

	return (
		<Page title={t("bankzaken.exports.title")}>
			<SectionContainer>
				<Section title={t("bankzaken.createExport.title")} helperText={t("bankzaken.createExport.helperText")}>
					<Stack spacing={5}>
						<Stack direction={["column", "row"]} alignItems={"flex-end"}>
							<FormControl flex={1}>
								<FormLabel>{t("global.period")}</FormLabel>
								<DatePicker
								 	autoComplete="no"
									aria-autocomplete="none"
									dateFormat={"dd-MM-yyyy"}
									selectsRange={true}
									isClearable={true}
									startDate={dateRange.from}
									endDate={dateRange.through}
									onChange={onChangeStartDate}
									customInput={<Input data-test="input.dateRange" autoComplete="no" aria-autocomplete="none" />} 
								/>
							</FormControl>
							<FormControl flex={1}>
								<Stack direction={["column", "row"]} alignItems={"flex-end"}>
									<Button colorScheme={"primary"} isLoading={$createExportOverschrijvingen.loading} isDisabled={!(dateRange.from && dateRange.through) || !paymentDateValid && useCustomPaymentDate} onClick={onClickExportButton}>{t("global.actions.export")}</Button>
								</Stack>
							</FormControl>
						</Stack>
						<Checkbox onChange={e => {
							onChangeUseCustomPaymentDate(e.target.checked ?? false)
						}} flex={1}>{t("exports.useCustomPaymentDate")}</Checkbox>
						{useCustomPaymentDate && (
							<Stack>
								<FormControl flex={1} isInvalid={!paymentDateValid}>
									<FormLabel>{t("exports.paymentDate")}</FormLabel>
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
									<FormErrorMessage>{t("exports.invalidPaymentDate", {"startDate": d().subtract(7, "days").format("L"), "endDate": d(dateRange.through).add(7, "days").format("L")})}</FormErrorMessage>
								</FormControl>
								<FormLabel>{t("exports.customPaymentInformation")}</FormLabel>
							</Stack>
						)}
					</Stack>
				</Section>
			</SectionContainer>

			<SectionContainer>
				<Section title={t("bankzaken.exports.title")} helperText={t("bankzaken.exports.helperText")}>
					<Stack spacing={5}>
						<Queryable query={$exports} children={(data) => {
							const exports: Export[] = [...data.exportsPaged.exports || []].sort((a: Export, b: Export) => {
								const timestampsExist = a.timestamp && b.timestamp;
								const sortDescending = a.timestamp >= b.timestamp ? -1 : 1;
								return timestampsExist ? sortDescending : -1;
							});
							setTotal(data.exportsPaged.pageInfo.count)

							return (
								<Stack>
									{isLoading ? <Loading></Loading> : 
									<Stack spacing={4}>
										{exports.map((e) => {
											const href = AppRoutes.Export(e.id);
											const overschrijvingen = e.overschrijvingen || []
											let total = 0;
											overschrijvingen.forEach(overschrijving => total = floatMathOperation(total, overschrijving.bedrag, 2, MathOperation.Plus))
											return (
												<HStack justify={"space-between"} key={e.id}>
													<Stack>
														<Stack flex={2} spacing={0}>
															<Stack direction={"row"}>
																<FormLabel>{t("exports.dateCreated")}</FormLabel>
																<Text fontSize={"sm"}>{d(e.timestamp).format("L LT")}</Text>
															</Stack>
															<Stack direction={"row"}>
																<FormLabel>{t("exports.period")}</FormLabel>
																<Text fontSize={"sm"}>{d(e.startDatum).format("L")} - {d(e.eindDatum).format("L")}</Text>
															</Stack>
															<Stack direction={"row"}>
																<FormLabel>{t("exports.paymentDate")}</FormLabel>
																{e.verwerkingDatum && (
																	<Text fontSize={"sm"}>{d(e.verwerkingDatum).format("L")}</Text>
																)}
																{!e.verwerkingDatum && (
																	<Text fontSize={"sm"}>{t("exports.individualPaymentDate")}</Text>
																)}
															</Stack>
															<Stack direction={"row"}>
																<FormLabel>{t("export.nOverschrijvingen")}</FormLabel>
																<Text fontSize={"sm"}>{overschrijvingen.length}</Text>
															</Stack>
															<Stack direction={"row"}>
																<FormLabel>{t("export.totaalBedrag")}</FormLabel>
																<Text fontSize={"sm"}>€{currencyFormat2(false).format(total)}</Text>
															</Stack>
															<Stack direction={"row"}>
																<FormLabel>{t("checksum.sha265")}</FormLabel>
																<Text fontSize={"sm"} maxWidth={["170px", "300px", "100%"]}>{e.sha256}</Text>
															</Stack>
														</Stack>
													</Stack>
													<Stack>
														{!isMobile && (
															<Box flex={0}>
																<Button size={"sm"} data-test="button.Download" leftIcon={<DownloadIcon />} as={"a"} target={"_blank"} href={href} download={href}>
																	{t("global.actions.download")}
																</Button>
															</Box>
														)}
													</Stack>
												</HStack>
											);
										})}
									</Stack>
								}
								<HStack justify={"center"}>
									<PaginationButtons />
								</HStack>
							</Stack>
							);
						}} />
					</Stack>
				</Section>
			</SectionContainer>
		</Page>
	);
};

export default Betaalinstructies;
