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
	FormHelperText,
	FormLabel,
	Heading,
	IconButton,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Spinner,
	Stack,
	Text,
	Tooltip,
	useToast
} from "@chakra-ui/core";
import React, {useEffect, useRef} from "react";
import {useInput, useIsMobile, useToggle, Validators} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Redirect, useHistory, useParams} from "react-router-dom";
import Routes from "../../config/routes";
import BackButton from "../BackButton";
import {FormLeft, FormRight} from "../Forms/FormLeftRight";
import {Regex} from "../../utils/things";
import {useMutation, useQuery} from "@apollo/client";
import {IOrganisatie} from "../../models";
import {GetOneOrganisatieQuery} from "../../services/graphql/queries";
import {DeleteOrganizationMutation, UpdateOrganizationMutation} from "../../services/graphql/mutations";
import DeletedIllustration from "../Illustrations/DeletedIllustration";

const OrganizationDetail = () => {
	const isMobile = useIsMobile();
	const {t} = useTranslation();
	const {id} = useParams();
	const toast = useToast();
	const [deleteDialogOpen, toggleDeleteDialog] = useToggle(false);
	const [isDeleted, toggleDeleted] = useToggle(false);
	const cancelDeleteRef = useRef(null);
	const {push} = useHistory();

	const kvkNumber = useInput({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(/^[0-9]{8}$/).test(v)]
	});
	const companyName = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const displayName = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const street = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const houseNumber = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});
	const zipcode = useInput({
		defaultValue: "",
		validate: [Validators.required, (v) => new RegExp(Regex.ZipcodeNL).test(v)],
		placeholder: "1234AB"
	});
	const city = useInput({
		defaultValue: "",
		validate: [Validators.required]
	});

	const {data, loading, error} = useQuery<{ organisatie: IOrganisatie }>(GetOneOrganisatieQuery, {
		variables: {id}
	});

	const [deleteMutation, {loading: deleteLoading}] = useMutation(DeleteOrganizationMutation, {variables: {id}});
	const [updateMutation, {loading: updateLoading}] = useMutation(UpdateOrganizationMutation);

	useEffect(() => {
		let mounted = true;

		if (mounted && data) {
			const {organisatie} = data;

			if (organisatie) {
				kvkNumber.setValue(organisatie.kvkNummer.toString());
				companyName.setValue(organisatie.kvkDetails.naam);
				displayName.setValue(organisatie.weergaveNaam);
				street.setValue(organisatie.kvkDetails.straatnaam);
				houseNumber.setValue(organisatie.kvkDetails.huisnummer);
				zipcode.setValue(organisatie.kvkDetails.postcode);
				city.setValue(organisatie.kvkDetails.plaatsnaam);
			}
		}

		return () => {
			mounted = false;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, loading]);

	const onClickBackButton = () => push(Routes.Organizations);
	const onSubmit = (e) => {
		e.preventDefault();

		const isFormValid = [
			kvkNumber,
			companyName,
			displayName,
			street,
			houseNumber,
			zipcode,
			city,
		].every(f => f.isValid);
		if (!isFormValid) {
			toast({
				status: "error",
				title: t("messages.organizations.invalidFormMessage"),
				position: "top",
			});
			return;
		}

		updateMutation({
			variables: {
				id,
				kvkNummer: kvkNumber.value,
				naam: companyName.value,
				weergaveNaam: displayName.value,
				straatnaam: street.value,
				huisnummer: houseNumber.value,
				postcode: zipcode.value,
				plaatsnaam: city.value,
			}
		}).then(() => {
			toast({
				status: "success",
				title: t("messages.organizations.updateSuccessMessage"),
				position: "top",
			});
		}).catch(err => {
			console.error(err);
			toast({
				position: "top",
				status: "error",
				variant: "solid",
				title: t("messages.genericError.title"),
				description: t("messages.genericError.description"),
			});
		})
	};
	const onCloseDeleteDialog = () => toggleDeleteDialog(false);
	const onConfirmDeleteDialog = () => {
		deleteMutation().then(() => {
			onCloseDeleteDialog();
			toast({
				title: t("messages.organizations.deleteConfirmMessage", {name: data?.organisatie.weergaveNaam}),
				position: "top",
				status: "success",
			});
			toggleDeleted(true);
		})
	};

	const isInvalid = (input) => input.dirty && !input.isValid;

	return (<>
		<BackButton to={Routes.Organizations} />

		{loading && (
			<Stack spacing={5} alignItems={"center"} justifyContent={"center"} my={10}>
				<Spinner />
			</Stack>
		)}
		{!loading && error && (
			<Redirect to={Routes.NotFound} />
		)}
		{!loading && !error && data && isDeleted && (
			<Stack justifyContent={"center"} alignItems={"center"} bg={"white"} p={20} spacing={10}>
				<Box as={DeletedIllustration} maxWidth={[200, 300, 400]} height={"auto"} />
				<Text fontSize={"sm"}>{t("messages.organizations.deleteConfirmMessage", {name: data.organisatie.weergaveNaam})}</Text>
				<Button variantColor="primary" onClick={onClickBackButton}>{t("buttons.organizations.backToList")}</Button>
			</Stack>
		)}
		{!loading && !error && data && !isDeleted && (
			<Stack spacing={5}>
				<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
					<Heading size={"lg"}>{data.organisatie.weergaveNaam}</Heading>

					<AlertDialog isOpen={deleteDialogOpen} leastDestructiveRef={cancelDeleteRef} onClose={onCloseDeleteDialog}>
						<AlertDialogOverlay />
						<AlertDialogContent>
							<AlertDialogHeader fontSize="lg" fontWeight="bold">{t("messages.organizations.deleteTitle")}</AlertDialogHeader>
							<AlertDialogBody>{t("messages.organizations.deleteQuestion", {name: `${data.organisatie.weergaveNaam}`})}</AlertDialogBody>
							<AlertDialogFooter>
								<Button ref={cancelDeleteRef} onClick={onCloseDeleteDialog}>{t("actions.cancel")}</Button>
								<Button isLoading={deleteLoading} variantColor="red" onClick={onConfirmDeleteDialog} ml={3}>{t("actions.delete")}</Button>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					<Menu>
						<IconButton as={MenuButton} icon="chevron-down" variant={"solid"} aria-label="Open menu" />
						<MenuList>
							<MenuItem onClick={() => toggleDeleteDialog(true)}>{t("actions.delete")}</MenuItem>
						</MenuList>
					</Menu>
				</Stack>

				<Box as={"form"} onSubmit={onSubmit}>
					<Stack maxWidth={1200} bg={"white"} p={5} borderRadius={10} spacing={5}>
						<Stack direction={isMobile ? "column" : "row"} spacing={2}>
							<FormLeft>
								<Heading size={"md"}>{t("forms.organizations.sections.organizational.title")}</Heading>
								<FormHelperText id="personal-helperText">{t("forms.organizations.sections.organizational.helperText")}</FormHelperText>
							</FormLeft>
							<FormRight>
								<Stack spacing={2} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1} flex={1}>
										<FormLabel htmlFor={"kvkNumber"}>{t("forms.organizations.fields.kvkNumber")}</FormLabel>
										<Tooltip label={t("forms.organizations.tooltips.kvkNumber")} aria-label={t("forms.organizations.fields.kvkNumber")} hasArrow
										         placement={isMobile ? "top" : "left"}>
											<Input isInvalid={isInvalid(kvkNumber)} {...kvkNumber.bind} id="kvkNumber" />
										</Tooltip>
									</Stack>
									<Stack spacing={1} flex={2}>
										<FormLabel htmlFor={"companyName"}>{t("forms.organizations.fields.companyName")}</FormLabel>
										<Input isInvalid={isInvalid(companyName)} {...companyName.bind} id="companyName" />
									</Stack>
								</Stack>
								<Stack spacing={2} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1} flex={1}>
										<FormLabel htmlFor={"displayName"}>{t("forms.organizations.fields.displayName")}</FormLabel>
										<Input isInvalid={isInvalid(displayName)} {...displayName.bind} id="displayName" />
									</Stack>
								</Stack>
							</FormRight>
						</Stack>

						<Divider />

						<Stack direction={isMobile ? "column" : "row"} spacing={2}>
							<FormLeft>
								<Heading size={"md"}>{t("forms.organizations.sections.contact.title")}</Heading>
								<FormHelperText>{t("forms.organizations.sections.contact.helperText")}</FormHelperText>
							</FormLeft>
							<FormRight>
								<Stack spacing={2} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1} flex={2}>
										<FormLabel htmlFor={"street"}>{t("forms.organizations.fields.street")}</FormLabel>
										<Input isInvalid={isInvalid(street)} {...street.bind} id="street" />
									</Stack>
									<Stack spacing={1} flex={1}>
										<FormLabel htmlFor={"houseNumber"}>{t("forms.organizations.fields.houseNumber")}</FormLabel>
										<Input isInvalid={isInvalid(houseNumber)} {...houseNumber.bind} id="houseNumber" />
									</Stack>
								</Stack>
								<Stack spacing={2} direction={isMobile ? "column" : "row"}>
									<Stack spacing={1} flex={1}>
										<FormLabel htmlFor={"zipcode"}>{t("forms.organizations.fields.zipcode")}</FormLabel>
										<Tooltip label={t("forms.organizations.tooltips.zipcode")} aria-label={t("forms.organizations.fields.zipcode")} hasArrow
										         placement={isMobile ? "top" : "left"}>
											<Input isInvalid={isInvalid(zipcode)} {...zipcode.bind} id="zipcode" />
										</Tooltip>
									</Stack>
									<Stack spacing={1} flex={2}>
										<FormLabel htmlFor={"city"}>{t("forms.organizations.fields.city")}</FormLabel>
										<Input isInvalid={isInvalid(city)} {...city.bind} id="city" />
									</Stack>
								</Stack>
							</FormRight>
						</Stack>

						<Divider />

						<Stack direction={isMobile ? "column" : "row"} spacing={2}>
							<FormLeft />
							<FormRight>
								<Stack direction={"row"} spacing={1} justifyContent={"flex-end"}>
									<Button isLoading={loading || updateLoading} type={"submit"} variantColor={"primary"} onClick={onSubmit}>{t("actions.save")}</Button>
								</Stack>
							</FormRight>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		)}
	</>);
};

export default OrganizationDetail;