import {ChevronDownIcon} from "@chakra-ui/icons";
import {IconButton, Menu, MenuButton, MenuItem, MenuList, useDisclosure} from "@chakra-ui/react";
import React, {useContext} from "react";
import {useTranslation} from "react-i18next";
import {NavLink, useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {
	Afspraak,
	GetAfspraakDocument,
	GetBurgerDocument,
	GetBurgersDocument,
	GetBurgersSearchDocument,
	useDeleteAfspraakMutation,
	useEndAfspraakMutation,
} from "../../../generated/graphql";
import d from "../../../utils/dayjs";
import useToaster from "../../../utils/useToaster";
import {BurgerSearchContext} from "../../Burgers/BurgerSearchContext";
import AfspraakDeleteModal from "./AfspraakDeleteModal";
import AfspraakEndModal from "./AfspraakEndModal";

const AfspraakDetailMenu: React.FC<{afspraak: Afspraak}> = ({afspraak}) => {
	const {t} = useTranslation();
	const navigate = useNavigate();
	const deleteModal = useDisclosure();
	const endModal = useDisclosure();
	const toast = useToaster();
	const {search} = useContext(BurgerSearchContext);

	const [endAfspraakMutation] = useEndAfspraakMutation({
		refetchQueries: [
			{query: GetAfspraakDocument, variables: {id: afspraak.id}},
		],
	});

	const [deleteAfspraak] = useDeleteAfspraakMutation({
		refetchQueries: [
			{query: GetBurgersDocument},
			{query: GetBurgerDocument, variables: {id: afspraak.burger?.id}},
			{query: GetBurgersSearchDocument, variables: {search}}
		],
		onCompleted: () => {
			if (afspraak.burger?.id) {
				navigate(AppRoutes.Burger(afspraak.burger.id));
			}
		},
	});

	const onClickDelete = () => {
		if (!deleteModal.isOpen) {
			endModal.onClose();
			deleteModal.onOpen();
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
		<AfspraakDeleteModal onSubmit={onClickDelete} isOpen={deleteModal.isOpen} onClose={deleteModal.onClose} />
		<AfspraakEndModal onSubmit={onSubmitEndAfspraak} isOpen={endModal.isOpen} onClose={endModal.onClose} />

		<Menu>
			<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} data-cy={"actionsMenuButton"} />
			<MenuList>
				<NavLink to={AppRoutes.EditAfspraak(afspraak.id)}><MenuItem>{t("global.actions.edit")}</MenuItem></NavLink>
				<MenuItem onClick={endModal.onOpen}>{t("global.actions.end")}</MenuItem>
				<MenuItem onClick={deleteModal.onOpen}>{t("global.actions.delete")}</MenuItem>
			</MenuList>
		</Menu>
	</>);
};
export default AfspraakDetailMenu;