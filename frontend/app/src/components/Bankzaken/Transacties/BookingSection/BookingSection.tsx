import {Stack, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import BookingSectionAfspraak from "./BookingsectionAfspraken";
import BookingSectionRubriek from "./BookingSectionRubriek";

const BookingSection = ({transaction}) => {
	const {t} = useTranslation();

	return (
		<Stack>
			<Tabs align={"start"} variant={"enclosed"}>
				<TabList>
					<Tab data-test="tab.bookingSection.agreement">{t("bookingSection.afspraak")}</Tab>
					<Tab data-test="tab.bookingSection.rubric">{t("bookingSection.rubriek")}</Tab>
				</TabList>
				<TabPanels>
					<TabPanel px={0}>
						<BookingSectionAfspraak transaction={transaction}></BookingSectionAfspraak>
					</TabPanel>
					<TabPanel px={0}>
						<BookingSectionRubriek transaction={transaction}></BookingSectionRubriek>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Stack>
	);
};
export default BookingSection;
