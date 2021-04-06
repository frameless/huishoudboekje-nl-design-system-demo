import {DownloadIcon} from "@chakra-ui/icons";
import {Box, Button, Divider, FormControl, FormLabel, IconButton, Input, Stack, Table, Tbody, Td, Text, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";
import DatePicker from "react-datepicker";
import {useInput} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Export, useCreateExportOverschrijvingenMutation, useGetExportsQuery} from "../../generated/graphql";
import d from "../../utils/dayjs";
import Queryable from "../../utils/Queryable";
import {Regex} from "../../utils/things";
import useToaster from "../../utils/useToaster";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import Label from "../Layouts/Label";
import Section from "../Layouts/Section";

const OverschrijvingenExport = () => {
	const {t} = useTranslation();
	const toast = useToaster();

	const $exports = useGetExportsQuery();
	const [createExportOverschrijvingen, $createExportOverschrijvingen] = useCreateExportOverschrijvingenMutation();

	const startDatum = useInput({
		defaultValue: d().startOf("quarter").format("L"),
		placeholder: d().startOf("quarter").format("L"),
		validate: [
			(v: string) => new RegExp(Regex.Date).test(v),
			(v: string) => d(v, "L").isValid(),
		],
	});
	const eindDatum = useInput({
		defaultValue: d().endOf("quarter").format("L"),
		placeholder: d().endOf("quarter").format("L"),
		validate: [
			(v: string) => new RegExp(Regex.Date).test(v),
			(v: string) => d(v, "L").isValid(),
		],
	});

	const onClickExportButton = () => {
		createExportOverschrijvingen({
			variables: {
				startDatum: d(startDatum.value, "L").format("YYYY-MM-DD"),
				eindDatum: d(eindDatum.value, "L").format("YYYY-MM-DD"),
			},
		}).then(() => {
			toast({
				success: t("messages.exports.createSuccessMessage"),
			});
			$exports.refetch();
		}).catch(err => {
			console.error(err);

			let errorMessage = err.message;
			if (err.message.includes("periode")) {
				errorMessage = t("messages.exports.noExportsInPeriod");
			}

			toast({
				error: errorMessage,
			});
		});
	};

	return (
		<Section>
			<Stack direction={["column", "row"]} spacing={5}>
				<FormLeft title={t("banking.exports.title")} helperText={t("banking.exports.helperText")} />
				<FormRight>
					<Stack direction={["column", "row"]} alignItems={"flex-end"}>
						<FormControl flex={1}>
							<FormLabel>{t("forms.common.fields.startDate")}</FormLabel>
							<DatePicker selected={d(startDatum.value, "L").isValid() ? d(startDatum.value, "L").toDate() : null} dateFormat={"dd-MM-yyyy"}
								onChange={(value: Date) => {
									if (value) {
										startDatum.setValue(d(value).format("L"));
									}
								}} customInput={<Input type="text" isInvalid={!d(startDatum.value, "L").isValid()} {...startDatum.bind} />} />
						</FormControl>
						<FormControl flex={1}>
							<FormLabel>{t("forms.common.fields.endDate")}</FormLabel>
							<DatePicker selected={d(eindDatum.value, "L").isValid() ? d(eindDatum.value, "L").toDate() : null} dateFormat={"dd-MM-yyyy"}
								onChange={(value: Date) => {
									if (value) {
										eindDatum.setValue(d(value).format("L"));
									}
								}} customInput={<Input type="text" isInvalid={!d(eindDatum.value, "L").isValid()} {...eindDatum.bind} />} />
						</FormControl>
						<FormControl flex={1}>
							<Button colorScheme={"primary"} isLoading={$createExportOverschrijvingen.loading} onClick={onClickExportButton}>{t("actions.export")}</Button>
						</FormControl>
					</Stack>

					<Divider />

					<Queryable query={$exports} children={(data) => {
						const exports: Export[] = data.exports || [];

						return (
							<Table variant={"noLeftPadding"}>
								<Thead>
									<Tr>
										<Th>{t("exports.period")}</Th>
										<Th>{t("exports.nOverschrijvingen")}</Th>
										<Th>{t("exports.dateCreated")}</Th>
										<Th />
									</Tr>
								</Thead>
								<Tbody>
									{exports.map(e => {
										const href = `/api/export/${e.id}`;

										return (
											<Tr key={e.id} _hover={{bg: "gray.100"}}>
												<Stack as={Td} direction={"row"} alignItems={"center"}>
													<Stack fontSize={"sm"} flex={2} spacing={0}>
														<Stack direction={"row"}>
															<Label>{t("van")}</Label>
															<Text>{d(e.startDatum).format("L")}</Text>
														</Stack>
														<Stack direction={"row"}>
															<Label>{t("tot")}</Label>
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

export default OverschrijvingenExport;