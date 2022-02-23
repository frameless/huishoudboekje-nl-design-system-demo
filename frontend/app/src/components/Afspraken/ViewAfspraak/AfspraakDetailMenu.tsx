import {ChevronDownIcon} from "@chakra-ui/icons";
import {IconButton, Menu, MenuButton, MenuItem, MenuList, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {NavLink, useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Afspraak, GetAfspraakDocument, GetBurgerDocument, GetBurgersDocument, GetBurgersSearchDocument, useDeleteAfspraakMutation, useEndAfspraakMutation} from "../../../generated/graphql";
import {useStore} from "../../../store";
import d from "../../../utils/dayjs";
import useToaster from "../../../utils/useToaster";
import AfspraakDeleteAlert from "./AfspraakDeleteAlert";
import AfspraakEndModal from "./AfspraakEndModal";

const AfspraakDetailMenu: React.FC<{afspraak: Afspraak}> = ({afspraak}) => {
	const {t} = useTranslation();
	const navigate = useNavigate();
	const endModal = useDisclosure();
	const toast = useToaster();
	const {store} = useStore();
	const deleteAlert = useDisclosure();

	const [endAfspraakMutation] = useEndAfspraakMutation({
		refetchQueries: [
			{query: GetAfspraakDocument, variables: {id: afspraak.id}},
		],
	});
	const [deleteAfspraak] = useDeleteAfspraakMutation({
		refetchQueries: [
			{query: GetBurgersDocument},
			{query: GetBurgerDocument, variables: {id: afspraak.burger?.id}},
			{query: GetBurgersSearchDocument, variables: {search: store.burgerSearch}},
		],
		onCompleted: () => {
			if (afspraak.burger?.id) {
				navigate(AppRoutes.Burger(afspraak.burger.id));
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
			}).then(result => {
				if (result.data?.deleteAfspraak?.ok) {
					toast({success: t("messages.deleteAfspraakSuccess")});
				}
			});
		}
	};

	const onSubmitEndAfspraak = (validThrough: Date) => {
		endAfspraakMutation({
			variables: {
				id: afspraak.id!,
				validThrough: d(validThrough).format("YYYY-MM-DD"),
			},
		}).then(result => {
			if (result.data?.updateAfspraak?.ok) {
				toast({
					success: t("endAfspraak.successMessage", {date: d(validThrough).format("L")}),
				});
				endModal.onClose();
			}
		});
	};

	return (<>
		{deleteAlert.isOpen && <AfspraakDeleteAlert onConfirm={onClickDelete} onClose={deleteAlert.onClose} />}
		{endModal.isOpen && <AfspraakEndModal onSubmit={onSubmitEndAfspraak} onClose={endModal.onClose} />}

		<Menu>
			<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} />
			<MenuList>
				<NavLink to={AppRoutes.EditAfspraak(afspraak.id)}><MenuItem>{t("global.actions.edit")}</MenuItem></NavLink>
				<MenuItem onClick={endModal.onOpen}>{t("global.actions.end")}</MenuItem>
				<MenuItem onClick={deleteAlert.onOpen}>{t("global.actions.delete")}</MenuItem>
			</MenuList>
		</Menu>
	</>);
};
export default AfspraakDetailMenu;