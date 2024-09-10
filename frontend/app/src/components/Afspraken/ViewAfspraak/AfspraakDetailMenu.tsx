import {IconButton, Menu, MenuButton, MenuItem, MenuList, useDisclosure} from "@chakra-ui/react";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Afspraak, GetAfspraakDocument, GetBurgerDetailsDocument, GetBurgersDocument, GetBurgersSearchDocument, useDeleteAfspraakMutation, useEndAfspraakMutation} from "../../../generated/graphql";
import useStore from "../../../store";
import d from "../../../utils/dayjs";
import useToaster from "../../../utils/useToaster";
import MenuIcon from "../../shared/MenuIcon";
import AfspraakDeleteAlert from "./AfspraakDeleteAlert";
import AfspraakEndModal from "./AfspraakEndModal";

const AfspraakDetailMenu: React.FC<{afspraak: Afspraak}> = ({afspraak}) => {
	const {t} = useTranslation();
	const location = useLocation()
	const navigate = useNavigate();
	const endModal = useDisclosure();
	const toast = useToaster();
	const burgerSearch = useStore(store => store.burgerSearch);
	const deleteAlert = useDisclosure();


	const [endAfspraakMutation] = useEndAfspraakMutation({
		refetchQueries: [
			{query: GetAfspraakDocument, variables: {id: afspraak.id}},
		],
	});
	const [deleteAfspraak] = useDeleteAfspraakMutation({
		refetchQueries: [
			{query: GetBurgersDocument},
			{query: GetBurgerDetailsDocument, variables: {id: afspraak.burger?.id}},
			{query: GetBurgersSearchDocument, variables: {search: burgerSearch}},
		],
		onCompleted: () => {
			if (afspraak.burger?.id) {
				navigate(AppRoutes.ViewBurger(String(afspraak.burger.id)));
			}
		},
	});

	const onClickDelete = () => {
		if (!deleteAlert.isOpen) {
			endModal.onClose();
			deleteAlert.onOpen();
		}
		else if (afspraak.id) {
			deleteAfspraak({
				variables: {
					id: afspraak.id,
				},
			}).then(() => {
				toast({success: t("messages.deleteAfspraakSuccess")});
			}).catch(err => {
				toast({
					error: err.message,
				});
			});
		}
	};

	const onSubmitEndAfspraak = (validThrough: Date) => {
		endAfspraakMutation({
			variables: {
				id: afspraak.id!,
				validThrough: d(validThrough).format("YYYY-MM-DD"),
			},
		}).then(() => {
			toast({
				success: t("endAfspraak.successMessage", {date: d(validThrough).format("L")}),
			});
			endModal.onClose();
		}).catch(err => {
			toast({
				error: err.message,
			});
		});
	};

	useEffect(() => {
		if (location.state?.hasOwnProperty("endAt")) {
			endModal.onOpen()
		}
	})

	return (<>
		{deleteAlert.isOpen && <AfspraakDeleteAlert onConfirm={onClickDelete} onClose={deleteAlert.onClose} />}
		{endModal.isOpen && <AfspraakEndModal startDate={afspraak.validFrom} onSubmit={onSubmitEndAfspraak} onClose={endModal.onClose} />}

		<Menu>
			<IconButton data-test="agreement.menuKebab" as={MenuButton} icon={<MenuIcon />} variant={"solid"} aria-label={"Open menu"} />
			<MenuList>
				<NavLink
					to={AppRoutes.EditAfspraak(String(afspraak.id))}><MenuItem data-test="agreement.menuEdit">{t("global.actions.edit")}</MenuItem></NavLink>
				<NavLink
					to={AppRoutes.CopyAfspraak(String(afspraak.id))}><MenuItem>{t("afspraak.copy")}</MenuItem></NavLink>
				<MenuItem data-test="agreement.menuEnd" onClick={endModal.onOpen}>{t("global.actions.end")}</MenuItem>
				<MenuItem data-test="agreement.menuDelete" onClick={deleteAlert.onOpen}>{t("global.actions.delete")}</MenuItem>
			</MenuList>
		</Menu>
	</>);
};

export default AfspraakDetailMenu;
