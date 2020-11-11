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
	Heading,
	Icon,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Spinner,
	Stack,
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
import {GetGebruikerAfsprakenQuery, GetOneGebruikerQuery} from "../../services/graphql/queries";
import {FormLeft, FormRight, Label} from "../Forms/FormLeftRight";
import RekeningList from "../Rekeningen/RekeningList";
import {CreateGebruikerRekeningMutation, DeleteAfspraakMutation, DeleteGebruikerMutation, ToggleAfspraakActiefMutation,} from "../../services/graphql/mutations";
import {useIsMobile, useToggle} from "react-grapple";
import DeadEndPage from "../DeadEndPage";
import RekeningForm from "../Rekeningen/RekeningForm";
import BurgerDetailProfileView from "./BurgerDetailProfileView";
import AfspraakItem from "../Agreements/AfpraakItem";

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

	const [showInactive] = useState(true);
	// const [showInactive, setShowInactive] = useState(true);
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
				title: t("messages.burgers.deleteConfirmMessage", {name: `${gebruikerData?.gebruiker.voornamen} ${gebruikerData?.gebruiker.achternaam}`}),
				position: "top",
				status: "success",
			});
			toggleDeleted(true);
		})
	};

	const {data: gebruikerData, loading: gebruikerLoading, refetch: refetchGebruiker} = useQuery<{ gebruiker: IGebruiker }>(GetOneGebruikerQuery, {
		fetchPolicy: "no-cache",
		variables: {id},
	});
	const [deleteAfspraak] = useMutation(DeleteAfspraakMutation);
	const [toggleAfspraakActive] = useMutation(ToggleAfspraakActiefMutation);

	useEffect(() => {
		let mounted = true;

		if (mounted) {
			if (gebruikerData && gebruikerData.gebruiker) {
				let _filteredAfspraken = gebruikerData.gebruiker.afspraken.sort((a, b) => a.id < b.id ? -1 : 1);
				// if (!showInactive) {
				// 	_filteredAfspraken = data.gebruiker.afspraken.filter(a => !showInactive ? a.actief : true);
				// }

				setFilteredAfspraken(_filteredAfspraken);
			}
		}

		return () => {
			mounted = false;
		}
	}, [gebruikerData, showInactive]);

	const onClickEditButton = () => push(Routes.EditBurger(id));
	const onClickAddAfspraakButton = () => push(Routes.CreateBurgerAgreement(id));
	const onDeleteAfspraak = (id) => {
		deleteAfspraak({
			variables: {id}
		}).then(result => {
			toast({
				title: t("messages.agreements.deleteConfirmMessage"),
				position: "top",
				status: "success",
			});
			refetchGebruiker();
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
	const onToggleAfspraakActive = async (afspraakId: number, actief: boolean) => {
		toggleAfspraakActive({
			variables: {
				id: afspraakId,
				gebruikerId: id,
				actief,
			}
		})
			.then(result => {
				toast({
					title: t("messages.agreements.toggleConfirmMessage"),
					position: "top",
					status: "success",
				});
				refetchGebruiker();
			})
			.catch(err => {
				console.error(err);
				toast({
					position: "top",
					status: "error",
					variant: "solid",
					description: t("messages.genericError.description"),
					title: t("messages.genericError.title")
				});
			});
	}
	// const onClickShowInactive = (e) => setShowInactive(e.currentTarget.checked);

	const renderPageContent = () => {
		if (!gebruikerData && gebruikerLoading) {
			return (
				<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
					<Spinner />
				</Stack>
			);
		}

		if (gebruikerData) {
			if (!gebruikerData.gebruiker) {
				return (
					<Redirect to={Routes.NotFound} />
				)
			}

			if (isDeleted) {
				return (
					<DeadEndPage message={t("messages.burgers.deleteConfirmMessage", {name: `${gebruikerData.gebruiker.voornamen} ${gebruikerData.gebruiker.achternaam}`})}>
						<Button variantColor={"primary"} onClick={() => push(Routes.Burgers)}>{t("actions.backToList")}</Button>
					</DeadEndPage>
				)
			}

			return (
				<Stack spacing={5}>
					<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
						<Heading size={"lg"}>{gebruikerData.gebruiker.voornamen} {gebruikerData.gebruiker.achternaam}</Heading>

						<AlertDialog isOpen={deleteDialogOpen} leastDestructiveRef={cancelDeleteRef} onClose={onCloseDeleteDialog}>
							<AlertDialogOverlay />
							<AlertDialogContent>
								<AlertDialogHeader fontSize="lg" fontWeight="bold">{t("messages.burgers.deleteTitle")}</AlertDialogHeader>
								<AlertDialogBody>{t("messages.burgers.deleteQuestion", {name: `${gebruikerData.gebruiker.voornamen} ${gebruikerData.gebruiker.achternaam}`})}</AlertDialogBody>
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

					<BurgerDetailProfileView gebruiker={gebruikerData.gebruiker} />

					{/* Rekeningen */}
					<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
						<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
							<FormLeft>
								<Heading display={"box"} size={"md"}>{t("forms.burgers.sections.rekeningen.title")}</Heading>
								<Label>{t("forms.burgers.sections.rekeningen.detailText")}</Label>
							</FormLeft>
							<FormRight justifyContent={"center"}>
								<RekeningList rekeningen={gebruikerData.gebruiker.rekeningen} gebruiker={gebruikerData.gebruiker} onChange={() => refetchGebruiker()} />
								{showCreateRekeningForm ? (<>
									{gebruikerData.gebruiker.rekeningen.length > 0 && <Divider />}
									<RekeningForm rekening={{
										rekeninghouder: `${gebruikerData.gebruiker.voorletters} ${gebruikerData.gebruiker.achternaam}`
									}} onSave={(rekening, resetForm) => {
										createGebruikerRekeningMutation({
											variables: {gebruikerId: id, rekening}
										}).then(() => {
											resetForm();
											toggleCreateRekeningForm(false);
											refetchGebruiker();
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
								{filteredAfspraken.length > 0 && (
									<Tabs index={tabIndex} onChange={onChangeTabs} variant={"enclosed"}>
										<TabList>
											<Tab>{t("agreements.incoming")} <Icon ml={3} name={"triangle-up"} color={"green.400"} size={"12px"} /> </Tab>
											<Tab>{t("agreements.outgoing")} <Icon ml={3} name={"triangle-down"} color={"red.400"} size={"12px"} /> </Tab>
										</TabList>
										<TabPanels>
											<TabPanel id="tab_incoming">
												{filteredAfspraken.filter(a => a.credit).map((a, i) => (
													<AfspraakItem key={a.id} data-id={a.id} afspraak={a} py={2} onDelete={(id: number) => onDeleteAfspraak(id)}
													              onToggleActive={(id: number) => onToggleAfspraakActive(id, !a.actief)} />
												))}
											</TabPanel>
											<TabPanel id="tab_outgoing">
												{filteredAfspraken.filter(a => !a.credit).map((a, i) => (
													<AfspraakItem key={a.id} data-id={a.id} afspraak={a} py={2} onDelete={(id: number) => onDeleteAfspraak(id)}
													              onToggleActive={(id: number) => onToggleAfspraakActive(id, !a.actief)} />
												))}
											</TabPanel>
										</TabPanels>
									</Tabs>
								)}

								<Stack direction={isMobile ? "column" : "row"} spacing={5}>
									<Button leftIcon={"add"} variantColor={"primary"} size={"sm"} onClick={onClickAddAfspraakButton}>{t("actions.add")}</Button>

									{/*{data.gebruiker.afspraken.length > 0 && (*/}
									{/*	<Stack isInline={true} alignItems={"center"} spacing={3}>*/}
									{/*		<Switch id="show-inactive-agreements" onChange={onClickShowInactive} />*/}
									{/*		<FormLabel htmlFor="show-inactive-agreements">{t("buttons.agreements.showInactive")}</FormLabel>*/}
									{/*	</Stack>*/}
									{/*)}*/}
								</Stack>
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