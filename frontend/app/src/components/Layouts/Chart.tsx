import {chakra} from "@chakra-ui/react";
import {Chart} from "react-google-charts";

const ChakraChart = chakra(Chart, {
	baseStyle: {
		h: "500px",
		maxW: "100%",
	}
});

export const chartProps = {
	chartLanguage: "nl"
}

export default ChakraChart;