import {ChevronDownIcon} from "@chakra-ui/icons";
import {IconButton, Menu, MenuButton, MenuItem, MenuList, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import Routes from "../../../config/routes";
import {Afspraak} from "../../../generated/graphql";
import AfspraakDeleteModal from "./AfspraakDeleteModal";
import AfspraakEndModal from "./AfspraakEndModal";

const AfspraakDetailMenu: React.FC<{afspraak: Afspraak, onDelete: VoidFunction, onEndAfspraak: (validThrough: Date) => void}> = ({afspraak, onDelete, onEndAfspraak}) => {
	const {t} = useTranslation();
	const deleteModal = useDisclosure();
	const endModal = useDisclosure();

	const onClickDelete = () => {
		if (!deleteModal.isOpen) {
			endModal.onClose();
			deleteModal.onOpen();
		}
		else {
			onDelete();
		}
	};

	const onSubmitEndAfspraak = (validThrough: Date) => {
		onEndAfspraak(validThrough);
		endModal.onClose();
	};

	return (<>
		<AfspraakDeleteModal onSubmit={onClickDelete} isOpen={deleteModal.isOpen} onClose={deleteModal.onClose} />
		<AfspraakEndModal onSubmit={onSubmitEndAfspraak} isOpen={endModal.isOpen} onClose={endModal.onClose} />

		<Menu>
			<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} data-cy={"actionsMenuButton"} />
			<MenuList>
				<NavLink to={Routes.EditAfspraak(afspraak.id)}><MenuItem>{t("actions.edit")}</MenuItem></NavLink>
				<MenuItem onClick={endModal.onOpen}>{t("actions.end")}</MenuItem>
				<MenuItem onClick={deleteModal.onOpen}>{t("actions.delete")}</MenuItem>
			</MenuList>
		</Menu>
	</>);
};
export default AfspraakDetailMenu;