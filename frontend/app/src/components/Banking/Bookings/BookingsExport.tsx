import {Button, FormControl, FormLabel, Input, Stack, Text, useToast} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import DatePicker from "react-datepicker";
import {useInput, useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Export, useGetExportsLazyQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {dateFormat, Regex} from "../../../utils/things";
import {FormLeft, FormRight, Label} from "../../Forms/FormLeftRight";
import Section from "../../Layouts/Section";

const BookingsExport = () => {
	const {t} = useTranslation();
	const isMobile = useIsMobile();

	const startDate = useInput({
		defaultValue: moment().startOf("quarter").format("L"),
		placeholder: moment().startOf("quarter").format("L"),
		validate: [
			(v: string) => new RegExp(Regex.Date).test(v),
			(v: string) => moment(v, "L").isValid(),
		]
	});
	const endDate = useInput({
		defaultValue: moment().endOf("quarter").format("L"),
		placeholder: moment().endOf("quarter").format("L"),
		validate: [
			(v: string) => new RegExp(Regex.Date).test(v),
			(v: string) => moment(v, "L").isValid(),
		]
	});

	const [loadExports, $exports] = useGetExportsLazyQuery({
		fetchPolicy: "no-cache"
	});

	const onClickExportButton = () => {
		// Todo: what happens next when the export button is clicked? (01-12-2020)

		loadExports({
			variables: {
				startDatum: moment(startDate.value, "L").startOf("day").format("YYYY-MM-DD"),
				eindDatum: moment(endDate.value, "L").endOf("day").format("YYYY-MM-DD"),
			}
		});
	};

	return (
		<Section>
			<Stack direction={isMobile ? "column" : "row"} spacing={2}>
				<FormLeft title={t("banking.exports.title")} helperText={t("banking.exports.helperText")} />
				<FormRight>
					<Stack direction={isMobile ? "column" : "row"} alignItems={"flex-end"}>
						<FormControl flex={1}>
							<FormLabel>{t("forms.common.fields.startDate")}</FormLabel>
							<DatePicker selected={moment(startDate.value, "L").isValid() ? moment(startDate.value, "L").toDate() : null} dateFormat={"dd-MM-yyyy"}
							            onChange={(value: Date) => {
								            if (value) {
									            startDate.setValue(moment(value).format("L"));
								            }
							            }} customInput={<Input type="text" isInvalid={!moment(startDate.value, "L").isValid()} {...startDate.bind} />} />
						</FormControl>
						<FormControl flex={1}>
							<FormLabel>{t("forms.common.fields.endDate")}</FormLabel>
							<DatePicker selected={moment(endDate.value, "L").isValid() ? moment(endDate.value, "L").toDate() : null} dateFormat={"dd-MM-yyyy"}
							            onChange={(value: Date) => {
								            if (value) {
									            endDate.setValue(moment(value).format("L"));
								            }
							            }} customInput={<Input type="text" isInvalid={!moment(endDate.value, "L").isValid()} {...endDate.bind} />} />
						</FormControl>
						<FormControl flex={1}>
							<Button colorScheme={"primary"} onClick={onClickExportButton}>{t("actions.export")}</Button>
						</FormControl>
					</Stack>
				</FormRight>
			</Stack>

			<Stack>
				<Stack direction={"row"} width={"100%"} alignItems={"center"} justifyContent={"center"}>
					<Stack direction={"row"} spacing={1} flex={1}>
						<Label>{t("exports.name")}</Label>
					</Stack>
					<Stack spacing={1} flex={1} alignItems={"flex-end"}>
						<Label>{t("exports.overschrijvingen")}</Label>
					</Stack>
					<Stack spacing={1} flex={1} alignItems={"flex-end"}>
						<Label>{t("forms.common.fields.date")}</Label>
					</Stack>
				</Stack>

				<Queryable query={$exports}>{(data) => {
					if (data) {
						const exports: Export[] = data.exports || [];

						return exports.map(e => (
							<Stack direction={"row"} width={"100%"} alignItems={"center"} justifyContent={"center"} key={e.id}>
								<Stack direction={"row"} spacing={1} flex={1}>
									<Text>{e.naam}</Text>
								</Stack>
								<Stack spacing={1} flex={1} alignItems={"flex-end"}>
									<Text>{e.overschrijvingen?.length}</Text>
								</Stack>
								<Stack spacing={1} flex={1} alignItems={"flex-end"}>
									<Text fontSize={"14px"} color={"gray.500"}>{dateFormat.format(e.timestamp)}</Text>
								</Stack>
							</Stack>
						));
					}

					return null;
				}}
				</Queryable>

			</Stack>
		</Section>
	);
};

export default BookingsExport;