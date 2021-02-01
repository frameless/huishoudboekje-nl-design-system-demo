import {DownloadIcon} from "@chakra-ui/icons";
import {Box, Button, Divider, FormControl, FormLabel, IconButton, Input, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useToast} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import DatePicker from "react-datepicker";
import {useInput} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Export, useCreateExportOverschrijvingenMutation, useGetExportsQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {Regex} from "../../../utils/things";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";
import Label from "../../Layouts/Label";
import Section from "../../Layouts/Section";

const BookingsExport = () => {
	const {t} = useTranslation();
	const toast = useToast();

	const $exports = useGetExportsQuery();
	const [createExportOverschrijvingen, $createExportOverschrijvingen] = useCreateExportOverschrijvingenMutation();

	const startDatum = useInput({
		defaultValue: moment().startOf("quarter").format("L"),
		placeholder: moment().startOf("quarter").format("L"),
		validate: [
			(v: string) => new RegExp(Regex.Date).test(v),
			(v: string) => moment(v, "L").isValid(),
		]
	});
	const eindDatum = useInput({
		defaultValue: moment().endOf("quarter").format("L"),
		placeholder: moment().endOf("quarter").format("L"),
		validate: [
			(v: string) => new RegExp(Regex.Date).test(v),
			(v: string) => moment(v, "L").isValid(),
		]
	});

	const onClickExportButton = () => {
		createExportOverschrijvingen({
			variables: {
				startDatum: moment(startDatum.value, "L").format("YYYY-MM-DD"),
				eindDatum: moment(eindDatum.value, "L").format("YYYY-MM-DD"),
			}
		}).then(() => {
			toast({
				status: "success",
				title: t("messages.exports.createSuccessMessage"),
				position: "top",
			});
			$exports.refetch();
		}).catch(err => {
			console.error(err);

			let errorMessage = err.message;
			if (err.message.includes("periode")) {
				errorMessage = t("messages.exports.noExportsInPeriod");
			}

			toast({
				position: "top",
				status: "error",
				variant: "solid",
				title: t("messages.genericError.title"),
				description: errorMessage,
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
							<DatePicker selected={moment(startDatum.value, "L").isValid() ? moment(startDatum.value, "L").toDate() : null} dateFormat={"dd-MM-yyyy"}
							            onChange={(value: Date) => {
								            if (value) {
									            startDatum.setValue(moment(value).format("L"));
								            }
							            }} customInput={<Input type="text" isInvalid={!moment(startDatum.value, "L").isValid()} {...startDatum.bind} />} />
						</FormControl>
						<FormControl flex={1}>
							<FormLabel>{t("forms.common.fields.endDate")}</FormLabel>
							<DatePicker selected={moment(eindDatum.value, "L").isValid() ? moment(eindDatum.value, "L").toDate() : null} dateFormat={"dd-MM-yyyy"}
							            onChange={(value: Date) => {
								            if (value) {
									            eindDatum.setValue(moment(value).format("L"));
								            }
							            }} customInput={<Input type="text" isInvalid={!moment(eindDatum.value, "L").isValid()} {...eindDatum.bind} />} />
						</FormControl>
						<FormControl flex={1}>
							<Button colorScheme={"primary"} isLoading={$createExportOverschrijvingen.loading} onClick={onClickExportButton}>{t("actions.export")}</Button>
						</FormControl>
					</Stack>

					<Divider />

					<Queryable query={$exports} children={(data: { exports: Export[] }) => {
						return (
							<Table>
								<Thead>
									<Tr>
										<Th>{t("exports.period")}</Th>
										<Th>{t("exports.nOverschrijvingen")}</Th>
										<Th>{t("exports.dateCreated")}</Th>
										<Th />
									</Tr>
								</Thead>
								<Tbody>
									{data.exports.map(e => {
										const href = `/api/export/${e.id}`;

										return (
											<Tr key={e.id} _hover={{ bg: "gray.100" }}>
												<Stack as={Td} direction={"row"} alignItems={"center"}>
													<Stack fontSize={"sm"} flex={2} spacing={0}>
														<Stack direction={"row"}>
															<Label>{t("van")}</Label>
															<Text>{moment(e.startDatum).format("L")}</Text>
														</Stack>
														<Stack direction={"row"}>
															<Label>{t("tot")}</Label>
															<Text>{moment(e.eindDatum).format("L")}</Text>
														</Stack>
													</Stack>
												</Stack>
												<Td>
													<Box flex={1}>
														{(e.overschrijvingen || []).length}
													</Box>
												</Td>
												<Td>
													<Box flex={1}>{moment(e.timestamp).format("L LT")}</Box>
												</Td>
												<Td>
													<Box flex={0}>
														<IconButton size={"sm"} variant={"ghost"} icon={<DownloadIcon />} aria-label={t("actions.download")} as={"a"} target={"_blank"} href={href} download={href} />
													</Box>
												</Td>
											</Tr>
										);
									})}
								</Tbody>
							</Table>
						)
					}} />
				</FormRight>
			</Stack>
		</Section>
	);
};

export default BookingsExport;