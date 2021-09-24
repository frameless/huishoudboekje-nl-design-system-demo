import {DownloadIcon} from "@chakra-ui/icons";
import {Box, Button, FormControl, FormLabel, HStack, Input, Stack, Text, useBreakpointValue} from "@chakra-ui/react";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import Routes from "../../../config/routes";
import {Export, GetExportsDocument, useCreateExportOverschrijvingenMutation, useGetExportsQuery} from "../../../generated/graphql";
import {DateRange} from "../../../models/models";
import d from "../../../utils/dayjs";
import Queryable from "../../../utils/Queryable";
import useHandleMutation from "../../../utils/useHandleMutation";
import {FormLeft, FormRight} from "../../Layouts/Forms";
import Page from "../../Layouts/Page";
import Section from "../../Layouts/Section";

const Betaalinstructies = () => {
	const {t} = useTranslation();
	const handleMutation = useHandleMutation();
	const $exports = useGetExportsQuery();
	const isMobile = useBreakpointValue([true, null, null, false]);
	const [createExportOverschrijvingen, $createExportOverschrijvingen] = useCreateExportOverschrijvingenMutation({
		refetchQueries: [
			{query: GetExportsDocument},
		],
	});

	const [dateRange, setDateRange] = useState<DateRange>({
		from: d().startOf("day").toDate(),
		through: d().endOf("day").toDate(),
	});

	const onClickExportButton = () => {
		handleMutation(createExportOverschrijvingen({
			variables: {
				startDatum: d(dateRange.from).format("YYYY-MM-DD"),
				eindDatum: d(dateRange.through).format("YYYY-MM-DD"),
			},
		}), t("messages.exports.createSuccessMessage"));
	};

	const onChangeStartDate = (value: [Date, Date]) => {
		const [from, through] = value;
		setDateRange(() => ({
			from, through,
		}));
	};

	return (
		<Page title={t("bankzaken.exports.title")}>
			<Section>
				<Stack spacing={5}>
					<FormLeft title={t("bankzaken.createExport.title")} helperText={t("bankzaken.createExport.helperText")} />
					<FormRight>
						<Stack direction={["column", "row"]} alignItems={"flex-end"}>
							<FormControl flex={1}>
								<FormLabel>{t("global.period")}</FormLabel>
								<DatePicker dateFormat={"dd-MM-yyyy"} selectsRange={true} isClearable={true}
									startDate={dateRange.from} endDate={dateRange.through} onChange={onChangeStartDate} customInput={<Input />} />
							</FormControl>
							<FormControl flex={1}>
								<Button colorScheme={"primary"} isLoading={$createExportOverschrijvingen.loading} isDisabled={!(dateRange.from && dateRange.through)} onClick={onClickExportButton}>{t("global.actions.export")}</Button>
							</FormControl>
						</Stack>
					</FormRight>
				</Stack>
			</Section>

			<Section>
				<FormLeft title={t("bankzaken.exports.title")} helperText={t("bankzaken.exports.helperText")} />
				<FormRight>
					<Stack spacing={5}>
						<Queryable query={$exports} children={(data) => {
							const exports: Export[] = [...data.exports || []].sort((a: Export, b: Export) => {
								return (a.timestamp && b.timestamp) ? (a.timestamp >= b.timestamp ? -1 : 1) : -1;
							});

							return (
								<Stack spacing={4}>
									{exports.map((e) => {
										const href = Routes.Export(e.id!);

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
															<FormLabel>{t("export.nOverschrijvingen")}</FormLabel>
															<Text fontSize={"sm"}>{(e.overschrijvingen || []).length}</Text>
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
															<Button size={"sm"} leftIcon={<DownloadIcon />} as={"a"} target={"_blank"} href={href} download={href}>
																{t("global.actions.download")}
															</Button>
														</Box>
													)}
												</Stack>
											</HStack>
										);
									})}
								</Stack>
							);
						}} />
					</Stack>
				</FormRight>
			</Section>
		</Page>
	);
};

export default Betaalinstructies;