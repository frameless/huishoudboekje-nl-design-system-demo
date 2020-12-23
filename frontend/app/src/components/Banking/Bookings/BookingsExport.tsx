import {Button, FormControl, FormLabel, Input, Stack, useToast} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import DatePicker from "react-datepicker";
import {useInput, useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {useGetExportsLazyQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {Regex} from "../../../utils/things";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";
import Section from "../../Layouts/Section";

const BookingsExport = () => {
	const {t} = useTranslation();
	const isMobile = useIsMobile();
	const toast = useToast();

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
		variables: {
			// beginTijd: moment(startDate.value, "L").startOf("day").toDate(),
			// eindTijd: moment(endDate.value, "L").endOf("day").toDate()
			beginTijd: moment(startDate.value, "L").startOf("day").toJSON().slice(0, -1),
			eindTijd: moment(endDate.value, "L").endOf("day").toJSON().slice(0,-1)
		}
	});

	const onClickExportButton = () => {
		// Todo: what happens next when the export button is clicked? (01-12-2020)
		// console.log(startDate.value, endDate.value);

		toast({
			position: "top",
			status: "warning",
			title: "Niet beschikbaar.",
			description: "Deze functionaliteit is nog niet beschikbaar.",
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

				<Button onClick={() => loadExports()}>Click</Button>

				<Queryable query={$exports}>{(data) => {
					return <pre>{JSON.stringify(data, null, 2)}</pre>
				}}
				</Queryable>

			</Stack>
		</Section>
	);
};

export default BookingsExport;