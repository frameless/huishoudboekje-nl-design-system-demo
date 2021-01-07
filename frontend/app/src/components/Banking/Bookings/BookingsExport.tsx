import {DownloadIcon} from "@chakra-ui/icons";
import {Box, Button, FormControl, FormLabel, IconButton, Input, Stack, useToast} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import DatePicker from "react-datepicker";
import {useInput, useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Export, useCreateExportOverschrijvingenMutation, useGetExportsQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {Regex} from "../../../utils/things";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";

const BookingsExport = () => {
	const {t} = useTranslation();
	const isMobile = useIsMobile();
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
		<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
			<Stack direction={isMobile ? "column" : "row"} spacing={2}>
				<FormLeft title={t("banking.exports.title")} helperText={t("banking.exports.helperText")} />
				<FormRight>
					<Stack direction={isMobile ? "column" : "row"} alignItems={"flex-end"}>
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

					<Queryable query={$exports} children={(data: { exports: Export[] }) => {
						return data.exports.map(e => {
							const href = `/api/export/${e.id}`;

							return (
								<Stack direction={["column", "row"]} alignItems={"center"} key={e.id}>
									<Box flex={0} textAlign={"right"}>{e.id}</Box>
									<Box flex={3}>{e.naam} ({e.overschrijvingen?.length || 0})</Box>
									<Box flex={1}>{moment(e.timestamp).format("L LT")}</Box>
									<Box flex={0}>
										<IconButton size={"sm"} icon={<DownloadIcon />} aria-label={t("actions.download")} as={"a"} target={"_blank"} href={href} download={href} />
									</Box>
								</Stack>
							);
						})
					}} />
				</FormRight>
			</Stack>
		</Stack>
	);
};

export default BookingsExport;