import {ComponentMeta, ComponentStory} from "@storybook/react";
import AddAlarmModal from "../components/Afspraken/ViewAfspraak/AddAlarmModal";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "Example/AddAlarmModal",
	component: AddAlarmModal,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		onSubmit: {
			type: "function",
			description: "Callback function that will handle whatever happens with the validated data from this form when it is submitted.",
		},
		onClose: {
			type: "function",
			description: "Function that will be called from this component in order to close it.",
		},
		afspraak: {
			type: "symbol",
			description: "The Afspraak the Alarm should be set for.",
		},
	},
} as ComponentMeta<typeof AddAlarmModal>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AddAlarmModal> = (args) => <AddAlarmModal {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
	onSubmit: (data) => {
		console.info("Submitted data: ", data);
	},
	onClose: () => {
		console.info("This will close this modal.");
	},
	afspraak: {
		"id": 8,
		"omschrijving": "Water",
		"bedrag": "41.60",
		"credit": false,
		"betaalinstructie": undefined,
		"zoektermen": [
			"Water",
			"ZOEKTERMPERSONA1",
		],
		"validFrom": "2021-01-01",
		"validThrough": null,
		"burger": {
			"id": 1,
			"voornamen": "Fien Sandra",
			"voorletters": "F.S.",
			"achternaam": "de Jager",
			"plaatsnaam": "Sloothuizen",
			"rekeningen": [
				{
					"id": 34,
					"iban": "NL84INGB2266765221",
					"rekeninghouder": "F. de Jager",
				},
			],
		},
		"alarm": undefined,
		"afdeling": {
			"id": 17,
			"naam": "Vitens N.V.",
			"organisatie": {
				"id": 8,
				"kvknummer": "05069581",
				"vestigingsnummer": "000015447650",
				"naam": "Vitens N.V.",
			},
			"postadressen": [
				{
					"id": "cc9b17ec-7d60-4702-bc0e-6efa029a4c14",
					"straatnaam": "Postbus",
					"huisnummer": "1205",
					"postcode": "8001BE",
					"plaatsnaam": "Zwolle",
				},
			],
			"rekeningen": [
				{
					"id": 15,
					"iban": "NL94INGB0000869000",
					"rekeninghouder": "VITENS NV",
				},
			],
		},
		"postadres": {
			"id": "cc9b17ec-7d60-4702-bc0e-6efa029a4c14",
			"straatnaam": "Postbus",
			"huisnummer": "1205",
			"postcode": "8001BE",
			"plaatsnaam": "Zwolle",
		},
		"tegenRekening": {
			"id": 15,
			"iban": "NL94INGB0000869000",
			"rekeninghouder": "VITENS NV",
		},
		"rubriek": {
			"id": 7,
			"naam": "Water",
			"grootboekrekening": {
				"id": "WBedHuiGweWat",
				"naam": "Water",
				"credit": false,
				"omschrijving": "Water huisvestingskosten",
				"referentie": "4201130",
				"rubriek": {
					"id": 7,
					"naam": "Water",
				},
			},
		},
		"matchingAfspraken": [],
	},
};