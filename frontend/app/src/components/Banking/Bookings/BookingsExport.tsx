import {DownloadIcon} from "@chakra-ui/icons";
import {Box, Button, Stack} from "@chakra-ui/react";
import React from "react";
import {useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";

const BookingsExport = () => {
	const {t} = useTranslation();
	const isMobile = useIsMobile();

	return (
		<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
			<Stack direction={isMobile ? "column" : "row"} spacing={2}>
				<FormLeft title={"Overschrijvingen"} helperText={"Hier is het mogelijk om overschrijvingen klaar te zetten en te exporteren."} />
				<FormRight>
					<Box>
						<Button colorScheme={"primary"} leftIcon={<DownloadIcon />}>{t("actions.export")}</Button>
					</Box>
				</FormRight>
			</Stack>
		</Stack>
	);
};

export default BookingsExport;