import {useMutation, useQuery} from "@apollo/client";
import {AddIcon, ChevronDownIcon, TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import React, {useEffect, useRef, useState} from "react";
import {useIsMobile, useToggle} from "react-grapple";
import {useTranslation} from "react-i18next";
import {useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import {IAfspraak, IGebruiker} from "../../models";
import {CreateGebruikerRekeningMutation, DeleteAfspraakMutation, DeleteGebruikerMutation} from "../../services/graphql/mutations";
import {GetOneGebruikerQuery} from "../../services/graphql/queries";
import AfspraakItem from "../Agreements/AfpraakItem";
import BackButton from "../BackButton";
import DeadEndPage from "../DeadEndPage";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import RekeningForm from "../Rekeningen/RekeningForm";
import RekeningList from "../Rekeningen/RekeningList";
import BurgerDetailProfileView from "./BurgerDetailProfileView";

const BurgerDetail = () => {
	const {t} = useTranslation();
	const {id} = useParams<{ id }>();
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

	const [deleteGebruiker, {loading: deleteLoading}] = useMutation(DeleteGebruikerMutation, {variables: {id: parseInt(id)}});
	const [createGebruikerRekeningMutation] = useMutation(CreateGebruikerRekeningMutation);

	const onCloseDeleteDialog = () => toggleDeleteDialog(false);
	const onConfirmDeleteDialog = () => {
		deleteGebruiker().then(() => {
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
		variables: {id: parseInt(id)},
	});
	const [deleteAfspraak] = useMutation(DeleteAfspraakMutation);

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
		deleteAfspraak().then(() => {
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

	const renderPageContent = () => {
		if (!gebruikerData && gebruikerLoading) {
			return (
				<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
					<Spinner />
				</Stack>
			);
		}

		if (gebruikerData) {
			if (gebruikerData.gebruiker) {
				if (isDeleted) {
					return (
						<DeadEndPage message={t("messages.burgers.deleteConfirmMessage", {name: `${gebruikerData.gebruiker.voornamen} ${gebruikerData.gebruiker.achternaam}`})}>
							<Button colorScheme={"primary"} onClick={() => push(Routes.Burgers)}>{t("actions.backToList")}</Button>
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
										<Button ref={cancelDeleteRef} onClick={onCloseDeleteDialog} data-cy={"inModal"}>{t("actions.cancel")}</Button>
										<Button isLoading={deleteLoading} colorScheme="red" onClick={onConfirmDeleteDialog} ml={3}
										        data-cy={"inModal"}>{t("actions.delete")}</Button>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>

							<Menu>
								<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} data-cy={"actionsMenuButton"} />
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
								<FormLeft title={t("forms.burgers.sections.rekeningen.title")} helperText={t("forms.burgers.sections.rekeningen.detailText")} />
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
											<Button leftIcon={<AddIcon />} colorScheme={"primary"} size={"sm"}
											        onClick={() => toggleCreateRekeningForm(true)}>{t("actions.add")}</Button>
										</Box>
									)}
								</FormRight>
							</Stack>
						</Stack>

						{/* Afspraken */}
						<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
							<Stack spacing={2} mb={1} direction={isMobile ? "column" : "row"}>
								<FormLeft title={t("forms.burgers.sections.agreements.title")} helperText={t("forms.burgers.sections.agreements.detailText")} />
								<FormRight justifyContent={"center"}>
									{filteredAfspraken.length > 0 && (
										<Tabs index={tabIndex} onChange={onChangeTabs} variant={"line"}>
											<TabList>
												<Tab>{t("agreements.incoming")} <TriangleUpIcon ml={3} color={"green.400"} w={"12px"} h={"12px"} /> </Tab>
												<Tab>{t("agreements.outgoing")} <TriangleDownIcon ml={3} color={"red.400"} w={"12px"} h={"12px"} /> </Tab>
											</TabList>
											<TabPanels>
												<TabPanel id="tab_incoming" p={0}>
													{filteredAfspraken.filter(a => a.credit).map((a, i) => (
														<AfspraakItem key={a.id} data-id={a.id} afspraak={a} py={2} onDelete={(id: number) => onDeleteAfspraak(id)} />
													))}
												</TabPanel>
												<TabPanel id="tab_outgoing" p={0}>
													{filteredAfspraken.filter(a => !a.credit).map((a, i) => (
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
						</Stack>
					</Stack>
				)
			}

			return (
				<DeadEndPage message={t("messages.burgers.notFound")}>
					<Button colorScheme={"primary"} onClick={() => push(Routes.Burgers)}>{t("actions.backToList")}</Button>
				</DeadEndPage>
			);
		}
	}

	return (<>
		<BackButton to={Routes.Burgers} />

		{renderPageContent()}
	</>);
};

export default BurgerDetail;