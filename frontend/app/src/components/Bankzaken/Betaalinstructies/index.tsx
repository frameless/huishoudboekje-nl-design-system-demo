import {DownloadIcon, ViewIcon} from "@chakra-ui/icons";
import {Box, Button, Checkbox, FormControl, FormErrorMessage, FormLabel, HStack, Input, Stack, Text, useBreakpointValue, useDisclosure} from "@chakra-ui/react";
import {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import {AppRoutes} from "../../../config/routes";
import {PaymentExportData, useGetPaymentExportFileLazyQuery, useGetPaymentExportFileQuery, useGetPaymentExportsPagedQuery, usePaymentRecordService_CreatePaymentRecordsMutation} from "../../../generated/graphql";
import {DateRange} from "../../../models/models";
import d from "../../../utils/dayjs";
import Queryable, {Loading} from "../../../utils/Queryable";
import useHandleMutation from "../../../utils/useHandleMutation";
import Page from "../../shared/Page";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";
import {MathOperation, currencyFormat2, floatMathOperation, getUnixTimestampFromDate} from "../../../utils/things";
import usePagination from "../../../utils/usePagination";
import PaymentRecordModal from "./CreatePaymentExport/PaymentRecordList";
import {Navigate, NavLink, useNavigate} from "react-router-dom";
import PaymentExportOverviewSkeleton from "./paymentExportOverviewSkeleton";

const Betaalinstructies = () => {
	const {t} = useTranslation();
	const handleMutation = useHandleMutation();
	const [isLoading, setIsLoading] = useState(true);
	const onPaginationClick = () => {
		setIsLoading(true)
	}
	const paymentRecordsModal = useDisclosure();

	const {offset, total, pageSize, setTotal, goFirst, PaginationButtons} = usePagination({pageSize: 10}, onPaginationClick);
	const $paymentExports = useGetPaymentExportsPagedQuery({
		fetchPolicy: "no-cache",
		variables: {
			input: {
				page: {
					skip: offset <= 1 ? 0 : offset,
					take: pageSize
				}
			}
		},
		onCompleted: () => {
			setIsLoading(false)
		},
	});



	const isMobile = useBreakpointValue([true, null, null, false]);

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
	let payment_date: string | undefined = undefined;
	const onClickExportButton = () => {
		payment_date = useCustomPaymentDate ? d(paymentDate).format("YYYY-MM-DD") : undefined
		paymentRecordServiceCreatePaymentRecordsMutation();
		paymentRecordsModal.onOpen();
	};

	const [paymentRecordServiceCreatePaymentRecordsMutation, {data, loading, error}] = usePaymentRecordService_CreatePaymentRecordsMutation({
		variables: {
			from: 1717408394,
			to: 1717581194,
			processAt: payment_date
		}
	})

	const navigate = useNavigate();

	const onChangeStartDate = (value: [Date, Date]) => {
		const [from, through] = value;

		if (value) {
			setDateRange(() => ({
				from, through,
			}));
			validateCustomPaymentDate(paymentDate, {from, through})
		}

	};

	const [getPaymentExportFile] = useGetPaymentExportFileLazyQuery()

	const onDownload = (id) => {
		getPaymentExportFile({
			variables: {
				input: {
					id: id
				}
			},
			onCompleted: (data) => {
				const file = data.PaymentExport_GetFile?.fileString;
				if (file == undefined) {
					throw new Error('Invalid or file data recieved');
				}
				const blob = new Blob([file], { type: 'text/plain' });
				const downloadLink = document.createElement('a');
				const url = URL.createObjectURL(blob);
				downloadLink.href = url;
				downloadLink.setAttribute('download', data.PaymentExport_GetFile?.name || "Download");
				document.body.appendChild(downloadLink);
				downloadLink.click();
				document.body.removeChild(downloadLink);
				URL.revokeObjectURL(url);
			}
		})
	}

	return (
		<Page title={t("bankzaken.exports.title")}>
			<SectionContainer>
				<Section>
					<Button colorScheme="primary" onClick={() => navigate(AppRoutes.CreateBetaalinstructies())}>Toevoegen</Button>
				</Section>
			</SectionContainer>
			<Queryable query={$paymentExports} loading={<PaymentExportOverviewSkeleton/>} children={(data) => {
				const exports: PaymentExportData[] = data.PaymentExport_GetPaged.data || []
				setTotal(data.PaymentExport_GetPaged.PageInfo.total_count)
				return (
					<SectionContainer>
						{exports.map((paymentExport) => {
							return (
									<HStack justify={"space-between"} key={paymentExport.id}>
										<Stack flex={2} spacing={0}>
											<HStack>
												<FormLabel>{t("exports.dateCreated")}</FormLabel>
												<Text fontSize={"sm"}>{d.unix(paymentExport.createdAt).format("L LT")}</Text>
											</HStack>
											<HStack>
												<FormLabel>{t("exports.period")}</FormLabel>
												<Text fontSize={"sm"}>{d.unix(paymentExport.startDate).format("L")} - {d.unix(paymentExport.endDate).format("L")}</Text>
											</HStack>
											<HStack>
												<FormLabel>{t("exports.paymentDate")}</FormLabel>
												{!paymentExport.recordsInfo?.processingDates ? (
													<Text fontSize={"sm"} >{t("exports.unknown")}</Text>
												) : (
													<Text fontSize={"sm"}>
													{paymentExport.recordsInfo?.processingDates.length === 1 ? (
														d.unix(paymentExport.recordsInfo?.processingDates[0]).format("L")
													) : (
														t("exports.multiple")
													)}
													</Text>
												)}
											</HStack>
											<HStack>
												<FormLabel>{t("export.nOverschrijvingen")}</FormLabel>
												<Text fontSize={"sm"}>{paymentExport.recordsInfo?.count}</Text>
											</HStack>
											<HStack>
												<FormLabel>{t("export.totaalBedrag")}</FormLabel>
												<Text fontSize={"sm"}>€
													{!paymentExport.recordsInfo?.totalAmount ? (
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
										{!isMobile && (
											<Stack>
												<Button size={"sm"} data-test="button.View" leftIcon={<ViewIcon />} onClick={() => {navigate(AppRoutes.ViewPaymentExport(String(paymentExport.id)))}}>
													{t("global.actions.view")}
												</Button>
												<Button size={"sm"} data-test="button.Download" leftIcon={<DownloadIcon />} colorScheme={"primary"} variant={"outline"} onClick={() => {onDownload(paymentExport.id)}}>
													{t("global.actions.download")}
												</Button>
											</Stack>
										)}
									</HStack>
							);
						})}
						<PaginationButtons />
					</SectionContainer>
				);
			}} />
		</Page >
	);
};

export default Betaalinstructies;
