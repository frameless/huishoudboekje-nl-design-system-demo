import {Button, Divider, FormControl, Heading, Input, InputGroup, Text} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css"
import {useInput} from "react-grapple";
import {Label} from "./components/Forms/FormLeftRight";
import Page from "./components/Layouts/Page";
import Section from "./components/Layouts/Section";
import {Regex} from "./utils/things";

const Test = () => {
	const date = useInput({
		defaultValue: moment().format("L"),
		validate: [
			(v) => new RegExp(Regex.Date).test(v),
			(v) => moment(v, "L").isValid(),
		],
	});

	let selected = moment(date.value, "L").isValid() ? moment(date.value, "L").toDate() : null;
	return (
		<Page title={"Testpagina"}>
			<Section bg={date.isValid ? "green.200" : "red.200"}>
				<Text fontWeight={"bold"}>{moment(date.value, "L").format("LLLL")}</Text>
				<pre>{JSON.stringify(date.value)}</pre>
			</Section>

			<Section>
				<Heading size={"md"}>HTML date input</Heading>
				<FormControl>
					<Label>Datum</Label>
					<Input {...date.bind} value={moment(date.value).format("DD MM YYYY")} type={"date"} />
				</FormControl>
			</Section>

			<Section>
				<Heading size={"md"}>HTML text input with validation</Heading>
				<FormControl>
					<Label>Datum</Label>
					<Input {...date.bind} type={"text"} isInvalid={!date.isValid} />
				</FormControl>
			</Section>

			<Section>
				<Heading size={"md"}>react-datepicker as Chakra Input</Heading>
				<FormControl>
					<Label>Datum</Label>
					<DatePicker selected={selected} dateFormat={"dd-MM-yyyy"} onChange={(value: Date) => {
						if(value){
							date.setValue(moment(value).format("L"));
						}
					}} customInput={<Input type="text" readonly {...date.bind} />} />
				</FormControl>
			</Section>

			<Section>
				<Heading size={"md"}>react-datepicker as Chakra Button</Heading>
				<FormControl>
					<Label>Datum</Label>
					<DatePicker selected={selected} dateFormat={"dd-MM-yyyy"} onChange={(value: Date) => {
						if(value){
							date.setValue(moment(value).format("L"));
						}
					}} customInput={<Button>{moment(date.value, "L").format("L")}</Button>} />
				</FormControl>
			</Section>
		</Page>
	);
};

export default Test;