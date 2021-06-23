import {DownloadIcon} from "@chakra-ui/icons";
import {Box, Button, Divider, FormControl, FormLabel, IconButton, Input, Stack, Table, Tbody, Td, Text, Th, Thead, Tr} from "@chakra-ui/react";
import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";
import Routes from "../../../config/routes";
import {Export, useCreateExportOverschrijvingenMutation, useGetExportsQuery} from "../../../generated/graphql";
import {DateRange} from "../../../models/models";
import d from "../../../utils/dayjs";
import Queryable from "../../../utils/Queryable";
import useHandleMutation from "../../../utils/useHandleMutation";
import {FormLeft, FormRight} from "../../Layouts/Forms";
import Section from "../../Layouts/Section";

const Betaalinstructies = () => {
	const {t} = useTranslation();
	const handleMutation = useHandleMutation();
	const $exports = useGetExportsQuery();
	const [createExportOverschrijvingen, $createExportOverschrijvingen] = useCreateExportOverschrijvingenMutation();

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
		}), t("messages.exports.createSuccessMessage"), () => $exports.refetch());
	};

	const onChangeStartDate = (value: [Date, Date]) => {
		const [from, through] = value;
		setDateRange(() => ({
			from, through,
		}));
	};

	return (
		<Section>
			<Stack direction={["column", "row"]} spacing={5}>
				<FormLeft title={t("banking.exports.title")} helperText={t("banking.exports.helperText")} />
				<FormRight>
					<Stack direction={["column", "row"]} alignItems={"flex-end"}>
						<FormControl flex={1}>
							<FormLabel>{t("forms.common.fields.period")}</FormLabel>
							<DatePicker dateFormat={"dd-MM-yyyy"} selectsRange={true} isClearable={true}
								startDate={dateRange.from} endDate={dateRange.through}
								onChange={onChangeStartDate} customInput={<Input />} />
						</FormControl>
						<FormControl flex={1}>
							<Button colorScheme={"primary"} isLoading={$createExportOverschrijvingen.loading} isDisabled={!(dateRange.from && dateRange.through)} onClick={onClickExportButton}>{t("actions.export")}</Button>
						</FormControl>
					</Stack>

					<Divider />

					<Queryable query={$exports} children={(data) => {
						const exports: Export[] = [...data.exports || []].sort((a: Export, b: Export) => {
							return (a.timestamp && b.timestamp) ? (a.timestamp >= b.timestamp ? -1 : 1) : 1;
						});

						return (
							<Table variant={"noLeftPadding"}>
								<Thead>
									<Tr>
										<Th>{t("exports.period")}</Th>
										<Th>{t("exports.nTransacties")}</Th>
										<Th>{t("exports.dateCreated")}</Th>
										<Th />
									</Tr>
								</Thead>
								<Tbody>
									{exports.map(e => {
										const href = Routes.Export(e.id!);

										return (
											<Tr key={e.id} _hover={{bg: "gray.100"}}>
												<Stack as={Td} direction={"row"} alignItems={"center"}>
													<Stack fontSize={"sm"} flex={2} spacing={0}>
														<Stack direction={"row"}>
															<FormLabel>{t("van")}</FormLabel>
															<Text>{d(e.startDatum).format("L")}</Text>
														</Stack>
														<Stack direction={"row"}>
															<FormLabel>{t("tot")}</FormLabel>
															<Text>{d(e.eindDatum).format("L")}</Text>
														</Stack>
													</Stack>
												</Stack>
												<Td>
													<Box flex={1}>
														{(e.overschrijvingen || []).length}
													</Box>
												</Td>
												<Td>
													<Box flex={1}>{d(e.timestamp).format("L LT")}</Box>
												</Td>
												<Td>
													<Box flex={0}>
														<IconButton size={"sm"} variant={"ghost"} icon={
															<DownloadIcon />} aria-label={t("actions.download")} as={"a"} target={"_blank"} href={href} download={href} />
													</Box>
												</Td>
											</Tr>
										);
									})}
								</Tbody>
							</Table>
						);
					}} />
				</FormRight>
			</Stack>
		</Section>
	);
};

export default Betaalinstructies;