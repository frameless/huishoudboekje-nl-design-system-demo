import {AddIcon, TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons";
import {Button, Stack, StackProps, Tab, TabList, TabPanel, TabPanels, Tabs, useToast} from "@chakra-ui/react";
import React, {useState} from "react";
import {useIsMobile} from "react-grapple";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../../config/routes";
import {Gebruiker, useDeleteAfspraakMutation} from "../../../generated/graphql";
import AfspraakItem from "../../Agreements/AfpraakItem";
import {FormLeft, FormRight} from "../../Forms/FormLeftRight";

const BurgerAfsprakenView: React.FC<StackProps & { burger: Gebruiker, refetch: VoidFunction }> = ({burger, refetch, ...props}) => {
	const {t} = useTranslation();
	const isMobile = useIsMobile();
	const toast = useToast();
	const {push} = useHistory();
	const [tabIndex, setTabIndex] = useState(0);
	const {afspraken} = burger;

	const onChangeTabs = (tabIdx) => {
		setTabIndex(tabIdx);
	};

	const onClickAddAfspraakButton = () => {
		if(burger.id){
			push(Routes.CreateBurgerAgreement(burger.id))
		}
	};

	const [deleteAfspraak] = useDeleteAfspraakMutation();
	const onDeleteAfspraak = (id) => {
		deleteAfspraak({variables: {id}}).then(() => {
			toast({
				title: t("messages.agreements.deleteConfirmMessage"),
				position: "top",
				status: "success",
			});
			refetch();
		}).catch(err => {
			console.error(err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				description: t("messages.genericError.description"),
				title: t("messages.genericError.title")
			});
		});
	};

	return (
		<Stack direction={isMobile ? "column" : "row"} {...props}>
			<FormLeft title={t("forms.burgers.sections.agreements.title")} helperText={t("forms.burgers.sections.agreements.detailText")} />
			<FormRight justifyContent={"center"}>
				{afspraken && afspraken.length > 0 && (
					<Tabs index={tabIndex} onChange={onChangeTabs} variant={"line"}>
						<TabList>
							<Tab>{t("agreements.incoming")} <TriangleUpIcon ml={3} color={"green.400"} w={"12px"} h={"12px"} /> </Tab>
							<Tab>{t("agreements.outgoing")} <TriangleDownIcon ml={3} color={"red.400"} w={"12px"} h={"12px"} /> </Tab>
						</TabList>
						<TabPanels>
							<TabPanel id="tab_incoming" p={0}>
								{afspraken.filter(a => a.credit).map((a, i) => (
									<AfspraakItem key={a.id} data-id={a.id} afspraak={a} py={2} onDelete={(id: number) => onDeleteAfspraak(id)} />
								))}
							</TabPanel>
							<TabPanel id="tab_outgoing" p={0}>
								{afspraken.filter(a => !a.credit).map((a, i) => (
									<AfspraakItem key={a.id} data-id={a.id} afspraak={a} py={2} onDelete={(id: number) => onDeleteAfspraak(id)} />
								))}
							</TabPanel>
						</TabPanels>
					</Tabs>
				)}

				<Stack direction={isMobile ? "column" : "row"} spacing={5}>
					<Button leftIcon={<AddIcon />} colorScheme={"primary"} size={"sm"} onClick={onClickAddAfspraakButton}>{t("actions.add")}</Button>

					{/*{data.gebruiker.afspraken.length > 0 && (*/}
					{/*	<Stack isInline={true} alignItems={"center"} spacing={3}>*/}
					{/*		<Switch id="show-inactive-agreements" onChange={onClickShowInactive} />*/}
					{/*		<FormLabel htmlFor="show-inactive-agreements">{t("buttons.agreements.showInactive")}</FormLabel>*/}
					{/*	</Stack>*/}
					{/*)}*/}
				</Stack>
			</FormRight>
		</Stack>
	);
};

export default BurgerAfsprakenView;