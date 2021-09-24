import {chakra} from "@chakra-ui/react";
import {Chart as GoogleChart} from "react-google-charts";

const Chart = chakra(GoogleChart, {
	baseStyle: {
		h: "500px",
		maxW: "100%",
	},
});

export const chartProps = {
	chartLanguage: "nl",
};

export default Chart;