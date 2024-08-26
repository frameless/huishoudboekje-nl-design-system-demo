import {Text, Divider, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, Stack, useDisclosure, Button} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import { AppRoutes } from "../../../../config/routes";
import Page from "../../../shared/Page";
import PaymentExportInfoSection from "./PaymentExportInfoSection";
import BackButton from "../../../shared/BackButton";
import PaymentExportRecordsSection from "./PaymentExportRecordsSection";
import { PaymentExportData, useGetPaymentExportQuery } from "../../../../generated/graphql";
import Queryable from "../../../../utils/Queryable";
import PageNotFound from "../../../shared/PageNotFound";
import d from "../../../../utils/dayjs";


const ViewPaymentExport = () => {
	const {id = ""} = useParams<{id: string}>();
    const {t} = useTranslation(["paymentrecords"]);

	const $export = useGetPaymentExportQuery({
		variables: {
			input: {
				id: id
			}
		}
	})
	
	return (
			<Queryable query={$export} children={(data) => {
				const paymentExport: PaymentExportData = data.PaymentExport_Get;
				
				if (!paymentExport) {
					return <PageNotFound />;
				}

				return (
					<Page title={t("viewExportPage.title", {start: d.unix(paymentExport.startDate).format("L"), end: d.unix(paymentExport.endDate).format("L")})} backButton={(
						<Stack direction={["column", "row"]} spacing={[2, 5]}>
							<BackButton label={t("viewExportPage.backButton")} to={AppRoutes.Betaalinstructies} />
						</Stack>
					)} >
						<PaymentExportInfoSection paymentExport={paymentExport} />
						{paymentExport.records != undefined && paymentExport.records.length > 0 &&
							<PaymentExportRecordsSection paymentRecords={paymentExport.records}/>
						}
					</Page >
				);
			}} 
		/>
    );
};

export default ViewPaymentExport;
