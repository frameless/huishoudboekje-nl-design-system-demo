import {Avatar, Grid, Stack, Text} from "@chakra-ui/react";
import {Meta, StoryFn} from "@storybook/react";
import GridCard from "./GridCard";

export default {
	title: "Huishoudboekje/GridCard",
	component: Grid,
	argTypes: {},
} as Meta<typeof Grid>;

type BurgerGridProps = {
	gridTemplateColumns: string[];
	gap: number;
	children: React.ReactNode;
};

const Template: StoryFn<BurgerGridProps> = ({gridTemplateColumns, gap, children}: any) => <Grid gridTemplateColumns={gridTemplateColumns}
	gap={gap}>{children}</Grid>;

const burgers = [
	"Theo Maaslander",
	"Fien Sandra de Jager",
	"Klaas Sjaaksma",
	"Chiel van Heeteren",
	"Mirjam de Rijke-Huijgens",
	"Bart Boot",
];

export const BurgerGrid = Template.bind({});
BurgerGrid.args = {
	gridTemplateColumns: ["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)", "repeat(6, 1fr)"],
	gap: 5,
	children: burgers.map(b => (
		<GridCard justifyContent={["flex-start", "center"]}>
			<Stack direction={["row", "column"]} spacing={5} align={"center"}>
				<Avatar name={b} />
				<Text fontSize={"md"} textAlign={"center"}>
					<strong>{b}</strong>
				</Text>
			</Stack>
		</GridCard>
	)),
};

const organisaties = [
	"Albert Heijn B.V.",
	"Belastingdienst",
	"Eneco Consumenten",
	"KPN B.V.",
	"Gemeente Utrecht",
];
export const OrganisatieGrid = Template.bind({});
OrganisatieGrid.args = {
	gridTemplateColumns: ["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"],
	gap: 5,
	children: organisaties.map(o => (
		<GridCard justifyContent={"center"}>
			<Stack spacing={1}>
				<Text fontSize={"md"} overflowX={"hidden"} textOverflow={"ellipsis"} width={"100%"} maxW={["300px", "250px"]}>
					<strong>{o}</strong>
				</Text>
			</Stack>
		</GridCard>
	)),
};