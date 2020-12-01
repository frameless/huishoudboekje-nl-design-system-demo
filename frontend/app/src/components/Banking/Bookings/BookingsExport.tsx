import {Button, FormControl, FormLabel, Input, Stack, useToast} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import {useInput, useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";

const BookingsExport = () => {
	const {t} = useTranslation();
	const isMobile = useIsMobile();
	const toast = useToast();

	const startDate = useInput({
		defaultValue: moment().startOf("quarter").format("yyyy-MM-DD"),
		placeholder: "dd-mm-jjjj"
	});
	const endDate = useInput({
		defaultValue: moment().endOf("quarter").format("yyyy-MM-DD"),
		placeholder: "dd-mm-jjjj"
	});

	const onClickExportButton = () => {
		// Todo: what happens next when the export button is clicked? (01-12-2020)
		// console.log(startDate.value, endDate.value);

		toast({
			position: "top",
			status: "warning",
			title: "Niet beschikbaar.",
			description: "Deze functionaliteit is nog niet beschikbaar."
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
							<Input {...startDate.bind} type={"date"} pattern="\d{2}-\d{2}-\d{4}" />
						</FormControl>
						<FormControl flex={1}>
							<FormLabel>{t("forms.common.fields.endDate")}</FormLabel>
							<Input {...endDate.bind} type={"date"} pattern="\d{2}-\d{2}-\d{4}" />
						</FormControl>
						<FormControl>
							<Button flex={1} colorScheme={"primary"} onClick={onClickExportButton}>{t("actions.export")}</Button>
						</FormControl>
					</Stack>
				</FormRight>
			</Stack>
		</Stack>
	);
};

export default BookingsExport;