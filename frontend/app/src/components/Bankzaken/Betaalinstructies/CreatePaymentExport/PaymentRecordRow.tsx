import {Box, Checkbox, extendTheme, FormControl, FormErrorMessage, FormLabel, Input, Portal, Stack, TableRowProps, Td, Text, Tr, useBreakpointValue} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {PaymentRecord} from "../../../../generated/graphql";
import {currencyFormat2, getUnixTimestampFromDate} from "../../../../utils/things";
import d from "../../../../utils/dayjs";
import dayjs from "../../../../utils/dayjs";
import {DateRange} from "../../../../models/models";
import DatePicker from "react-datepicker";

const PaymentRecordRow: React.FC<TableRowProps & {record, endDate: number | undefined, updateSelectedCount, recordIndex, sectionKey: string}> = ({sectionKey, record, recordIndex, endDate, updateSelectedCount, ...props}) => {
	const {t} = useTranslation(["paymentrecords"]);
	const isMobile = useBreakpointValue([true, null, null, false]);
	const amount = record.amount ?? 0

	function onClick(value) {
		updateSelectedCount(sectionKey, record.id)
	}


	return (
		<Tr {...props}>
			<Td verticalAlign={"center"}>
				<Text>{record.agreement?.omschrijving}</Text>
			</Td>
			<Td verticalAlign={"center"}>
				<Text>{record.agreement?.tegenRekening?.rekeninghouder}</Text>
			</Td>
			<Td verticalAlign={"center"}>
				<Stack spacing={1} flex={1} align={"flex-start"} justify={"center"}>
					<Box textAlign={"left"}>{currencyFormat2().format(amount / 100)}</Box>
				</Stack>
			</Td>
			<Td verticalAlign={"center"}>
				<Text>{dayjs.unix(record.processAt).format("DD-MM-YYYY")}</Text>
			</Td>
			<Td justifyContent={"end"} textAlign={"center"}>
				<Checkbox onChange={onClick} value={record.id}></Checkbox>
			</Td>
		</Tr>
	);
};

export default PaymentRecordRow;
