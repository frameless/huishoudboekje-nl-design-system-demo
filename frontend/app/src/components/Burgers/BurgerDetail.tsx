import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Box,
	Button,
	Divider,
	FormLabel,
	Heading,
	Icon,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Spinner,
	Stack,
	Switch,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useToast,
} from "@chakra-ui/core";
import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import BackButton from "../BackButton";
import {useMutation, useQuery} from "@apollo/client";
import {IAfspraak, IGebruiker} from "../../models";
import {GetOneGebruikerQuery} from "../../services/graphql/queries";
import {FormLeft, FormRight, Label} from "../Forms/FormLeftRight";
import RekeningList from "../Rekeningen/RekeningList";
import {CreateGebruikerRekeningMutation, DeleteGebruikerMutation,} from "../../services/graphql/mutations";
import {useIsMobile, useToggle} from "react-grapple";
import DeadEndPage from "../DeadEndPage";
import RekeningForm from "../Rekeningen/RekeningForm";
import BurgerDetailProfileView from "./BurgerDetailProfileView";

const BurgerDetail = () => {
	const {t} = useTranslation();
	const {id} = useParams();
	const {push} = useHistory();
	const toast = useToast();
	const isMobile = useIsMobile();

	const [tabIndex, setTabIndex] = useState(0);
	const onChangeTabs = (tabIdx) => {
		setTabIndex(tabIdx);
	};

	const [showInactive, setShowInactive] = useState(false);
	const [filteredAfspraken, setFilteredAfspraken] = useState<IAfspraak[]>([]);

	const cancelDeleteRef = useRef(null);
	const [deleteDialogOpen, toggleDeleteDialog] = useToggle(false);
	const [isDeleted, toggleDeleted] = useToggle(false);
	const [showCreateRekeningForm, toggleCreateRekeningForm] = useToggle(false);

	const [deleteMutation, {loading: deleteLoading}] = useMutation(DeleteGebruikerMutation, {variables: {id}});
	const [createGebruikerRekeningMutation] = useMutation(CreateGebruikerRekeningMutation);

	const onCloseDeleteDialog = () => toggleDeleteDialog(false);
	const onConfirmDeleteDialog = () => {
		deleteMutation().then(() => {
			onCloseDeleteDialog();
			toast({
				title: t("messages.burgers.deleteConfirmMessage", {name: `${data?.gebruiker.voornamen} ${data?.gebruiker.achternaam}`}),
				position: "top",
				status: "success",
			});
			toggleDeleted(true);
		})
	};

	const {data, loading, refetch} = useQuery<{ gebruiker: IGebruiker }>(GetOneGebruikerQuery, {
		fetchPolicy: "no-cache",
		variables: {id},
	});

	useEffect(() => {
		let mounted = true;

		if (mounted) {
			if (data && data.gebruiker) {
				setFilteredAfspraken(data.gebruiker.afspraken.filter(a => !showInactive ? a.actief : true));
			}
		}

		return () => {
			mounted = false;
		}
	}, [data, showInactive])

	const onClickEditButton = () => push(Routes.EditBurger(id));
	const onClickAddAfspraakButton = () => push(Routes.CreateBurgerAgreement(id));
	const onClickShowInactive = (e: React.FormEvent<HTMLInputElement>) => setShowInactive(e.currentTarget.checked);

	const renderPageContent = () => {
		if (loading) {
			return (
				<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
					<Spinner />
				</Stack>
			);
		}

		if (data) {
			if (!data.gebruiker) {
				return (
					<Redirect to={Routes.NotFound} />
				)
			}

			if (isDeleted) {
				return (
					<DeadEndPage message={t("messages.burgers.deleteConfirmMessage", {name: `${data.gebruiker.voornamen} ${data.gebruiker.achternaam}`})}>
						<Button variantColor={"primary"} onClick={() => push(Routes.Burgers)}>{t("actions.backToList")}</Button>
					</DeadEndPage>
				)
			}

			return (
				<Stack spacing={5}>
					<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
						<Heading size={"lg"}>{data.gebruiker.voornamen} {data.gebruiker.achternaam}</Heading>

						<AlertDialog isOpen={deleteDialogOpen} leastDestructiveRef={cancelDeleteRef} onClose={onCloseDeleteDialog}>
							<AlertDialogOverlay />
							<AlertDialogContent>
								<AlertDialogHeader fontSize="lg" fontWeight="bold">{t("messages.burgers.deleteTitle")}</AlertDialogHeader>
								<AlertDialogBody>{t("messages.burgers.deleteQuestion", {name: `${data.gebruiker.voornamen} ${data.gebruiker.achternaam}`})}</AlertDialogBody>
								<AlertDialogFooter>
									<Button ref={cancelDeleteRef} onClick={onCloseDeleteDialog}>{t("actions.cancel")}</Button>
									<Button isLoading={deleteLoading} variantColor="red" onClick={onConfirmDeleteDialog} ml={3}>{t("actions.delete")}</Button>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>

						<Menu>
							<IconButton as={MenuButton} icon="chevron-down" variant={"solid"} aria-label="Open menu" />
							<MenuList>
								<MenuItem onClick={onClickEditButton}>{t("actions.edit")}</MenuItem>
								<MenuItem onClick={() => toggleDeleteDialog(true)}>{t("actions.delete")}</MenuItem>
							</MenuList>
						</Menu>
					</Stack>

					<BurgerDetailProfileView gebruiker={data.gebruiker} />

					{/* Rekeningen */}
					<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
						<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
							<FormLeft>
								<Heading display={"box"} size={"md"}>{t("forms.burgers.sections.rekeningen.title")}</Heading>
								<Label>{t("forms.burgers.sections.rekeningen.detailText")}</Label>
							</FormLeft>
							<FormRight justifyContent={"center"}>
								<RekeningList rekeningen={data.gebruiker.rekeningen} gebruiker={data.gebruiker} onChange={() => refetch()} />
								{showCreateRekeningForm ? (<>
									{data.gebruiker.rekeningen.length > 0 && <Divider />}
									<RekeningForm rekening={{
										rekeninghouder: `${data.gebruiker.voorletters} ${data.gebruiker.achternaam}`
									}} onSave={(rekening, resetForm) => {
										createGebruikerRekeningMutation({
											variables: {gebruikerId: id, rekening}
										}).then(() => {
											resetForm();
											toggleCreateRekeningForm(false);
											refetch();
										});
									}} onCancel={() => {
										toggleCreateRekeningForm(false)
									}} />
								</>) : (
									<Box>
										<Button leftIcon={"add"} variantColor={"primary"} size={"sm"} onClick={() => toggleCreateRekeningForm(true)}>{t("actions.add")}</Button>
									</Box>
								)}
							</FormRight>
						</Stack>
					</Stack>

					{/* Afspraken */}
					<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
						<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
							<FormLeft>
								<Stack>
									<Box>
										<Heading size={"md"}>{t("forms.burgers.sections.agreements.title")}</Heading>
										<Label>{t("forms.burgers.sections.agreements.detailText")}</Label>
									</Box>
								</Stack>
							</FormLeft>
							<FormRight>
								<Stack direction={isMobile ? "column" : "row"} spacing={5}>
									<Button leftIcon={"add"} variantColor={"primary"} size={"sm"} onClick={onClickAddAfspraakButton}>{t("actions.add")}</Button>

									{data.gebruiker.afspraken.length > 0 && (
										<Stack isInline={true} alignItems={"center"} spacing={3}>
											<Switch id="show-inactive-agreements" onChange={onClickShowInactive} />
											<FormLabel htmlFor="show-inactive-agreements">{t("buttons.agreements.showInactive")}</FormLabel>
										</Stack>
									)}
								</Stack>

								<Tabs index={tabIndex} onChange={onChangeTabs} variant={"enclosed"}>
									<TabList>
										<Tab>{t("agreements.incoming")} <Icon ml={3} name={"triangle-up"} color={"green.400"} size={"12px"} /> </Tab>
										<Tab>{t("agreements.outgoing")} <Icon ml={3} name={"triangle-down"} color={"red.400"} size={"12px"} /> </Tab>
									</TabList>
									<TabPanels>
										<TabPanel id="tab_incoming">
											{filteredAfspraken.filter(a => a.credit).map((a, i) => (
												<Stack key={i} direction={"row"} spacing={2}>
													<pre className="debug">{JSON.stringify(a, null, 2)}</pre>
												</Stack>
											))}
										</TabPanel>
										<TabPanel id="tab_outgoing">
											{filteredAfspraken.filter(a => !a.credit).map((a, i) => (
												<Stack key={i} direction={"row"} spacing={2}>
													<pre className="debug">{JSON.stringify(a, null, 2)}</pre>
												</Stack>
											))}
										</TabPanel>
									</TabPanels>
								</Tabs>
							</FormRight>
						</Stack>
					</Stack>
				</Stack>
			);
		}
	}

	return (<>
		<BackButton to={Routes.Burgers} />

		{renderPageContent()}
	</>);
};

export default BurgerDetail;