import {Flex, Stack, Text} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import {FaQuestion, FaRegBuilding, RiUserLine} from "react-icons/all";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";

const RoundIcon = ({children, ...props}) => {
	return (
		<Flex w={8} h={8} borderRadius={"100%"} border={"1px solid"} borderColor={"gray.300"} justifyContent={"center"} alignItems={"center"} {...props}>
			{children}
		</Flex>
	)
}

// Todo: Transactie verwerken: met en zonder suggestie, suggestie geaccepteerd, of afgewezen, en/of alleen deze of voor altijd geaccepteerd.

enum AuditTrailAction {
	Create = "create",
	Update = "update",
	Delete = "delete"
}

enum AuditTrailEntity {
	Organisatie = "organisatie",
	Burger = "burger",
	Afspraak = "afspraak",
}

const auditTrailData = [
	{name: "Koen Brouwer", subject: [AuditTrailAction.Create, AuditTrailEntity.Organisatie], time: "2021-05-01 13:00"},
	{name: "Koen Brouwer", subject: [AuditTrailAction.Create, AuditTrailEntity.Organisatie], time: "2021-05-01 13:02"},
	{name: "Koen Brouwer", subject: [AuditTrailAction.Create, AuditTrailEntity.Organisatie], time: "2021-05-01 13:04"},
	{name: "Koen Brouwer", subject: [AuditTrailAction.Create, AuditTrailEntity.Organisatie], time: "2021-05-01 13:06"},
	{name: "Bauke Huijbers", subject: [AuditTrailAction.Create, AuditTrailEntity.Burger], time: "2021-05-01 13:24"},
	{name: "Bauke Huijbers", subject: [AuditTrailAction.Create, AuditTrailEntity.Burger], time: "2021-05-01 13:26"},
	{name: "Bauke Huijbers", subject: [AuditTrailAction.Create, AuditTrailEntity.Burger], time: "2021-05-01 13:28"},
	{name: "Christian Hulleman", subject: [AuditTrailAction.Update, AuditTrailEntity.Afspraak], time: "2021-05-01 13:24"},
	{name: "Christian Hulleman", subject: [AuditTrailAction.Update, AuditTrailEntity.Afspraak], time: "2021-05-01 13:03"},
];

const AuditTrailSubjectToReadable = (subject) => {
	const [action, entity] = subject;

	let text = "";
	let icon: JSX.Element;

	switch (action) {
		case AuditTrailAction.Create: {
			text = `heeft een nieuwe ${entity} toegevoegd.`;
			break;
		}
		case AuditTrailAction.Update: {
			text = `heeft een ${entity} bewerkt.`;
			break;
		}
		default: {
			text = `${action} ${entity}`;
			break;
		}
	}

	switch (entity) {
		case AuditTrailEntity.Burger: {
			icon = <RiUserLine />;
			break;
		}
		case AuditTrailEntity.Organisatie: {
			icon = <FaRegBuilding />;
			break;
		}
		default: {
			icon = <FaQuestion />;
		}
	}

	return {
		icon, text
	};
}


const Gebeurtenissen = () => {
	const sortAuditTrailByTime = (a, b) => {
		return moment(a.time).isBefore(b.time) ? 1 : -1;
	};

	return (
		<Page title={"Gebeurtenissen"}>

			<Section>
				<Stack spacing={5}>

					{auditTrailData.sort(sortAuditTrailByTime).map(a => {
						const readable = AuditTrailSubjectToReadable(a.subject);
						return (
							<Stack spacing={3} direction={"row"} alignItems={"center"}>
								<Stack>
									<RoundIcon>{readable.icon}</RoundIcon>
								</Stack>
								<Stack spacing={0}>
									<Stack direction={"row"} spacing={1} alignItems={"center"}>
										<Text fontWeight={"700"}>{a.name}</Text>
										<Text>{readable.text}</Text>
									</Stack>
									<Text fontSize={"sm"} color={"gray.500"}>{moment(a.time, "YYYY-MM-DD HH:mm").format("L LT")}</Text>
								</Stack>
							</Stack>
						);
					})}

				</Stack>
			</Section>

		</Page>
	);
};

export default Gebeurtenissen;