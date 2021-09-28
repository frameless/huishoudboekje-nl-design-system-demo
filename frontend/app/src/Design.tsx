import {Stack, Text} from "@chakra-ui/react";
import React from "react";
import Select from "react-select";
import {FormLeft, FormRight} from "./components/Layouts/Forms";
import Page from "./components/Layouts/Page";
import {MultiLineOption, MultiLineValueContainer, ReverseMultiLineOption, ReverseMultiLineValueContainer} from "./components/Layouts/ReactSelect/CustomComponents";
import Section from "./components/Layouts/Section";
import {useReactSelectStyles} from "./utils/things";

const Design = () => {
	const reactSelectStyles = useReactSelectStyles();

	const defaultSelect = {
		options: [
			{key: 1, value: 1, label: "Optie 1"},
			{key: 2, value: 2, label: "Optie 2"},
			{key: 3, value: 3, label: "Optie 3"},
			{key: 4, value: 4, label: "Optie 4"},
		],
		props: {
			isClearable: true,
			styles: reactSelectStyles.default,
			placeholder: "Selecteer..."
		},
	};

	const multilineSelect = {
		options: [
			{key: 1, value: 1, label: ["Option 1", "Description of option 1"]},
			{key: 2, value: 2, label: ["Option 2", "Description of option 2"]},
			{key: 3, value: 3, label: ["Option 3", "Description of option 3"]},
			{key: 4, value: 4, label: ["Option 4", "Description of option 4"]},
		],
		props: {
			isClearable: true,
			components: {
				Option: MultiLineOption,
				ValueContainer: MultiLineValueContainer,
			},
		},
	};

	const reverseMultilineSelect = {
		options: [
			{key: 1, value: 1, label: ["Description of option 1", "Option 1"]},
			{key: 2, value: 2, label: ["Description of option 2", "Option 2"]},
			{key: 3, value: 3, label: ["Description of option 3", "Option 3"]},
			{key: 4, value: 4, label: ["Description of option 4", "Option 4"]},
		],
		props: {
			isClearable: true,
			styles: reactSelectStyles.default,
			components: {
				Option: ReverseMultiLineOption,
				ValueContainer: ReverseMultiLineValueContainer,
			},
		},
	};

	return (
		<Page title={"Design Elements"}>
			<Section>
				<Stack>
					<FormLeft title={"Standard Select with styles that match the Chakra UI styles"} />
					<FormRight>
						<Stack>
							<Text>This the standard react-select element with <code>reactSelectStyles.default</code>.</Text>
							<Select options={defaultSelect.options} {...defaultSelect.props} />
						</Stack>
					</FormRight>
				</Stack>
			</Section>

			<Section>
				<Stack>
					<FormLeft title={"Select with double row"} />
					<FormRight>
						<Stack>
							<Text>This is a react-select with custom components for adding an extra line of text in the option element.</Text>
							<Select options={multilineSelect.options} styles={reactSelectStyles.default} {...multilineSelect.props} />
						</Stack>
					</FormRight>
				</Stack>
			</Section>

			<Section>
				<Stack>
					<FormLeft title={"Select with double row, reversed"} />
					<FormRight>
						<Stack>
							<Text>This is a react-select with custom components for adding an extra line of text in the option element.</Text>
							<Select options={reverseMultilineSelect.options} {...reverseMultilineSelect.props} />
						</Stack>
					</FormRight>
				</Stack>
			</Section>
		</Page>
	);
};

export default Design;