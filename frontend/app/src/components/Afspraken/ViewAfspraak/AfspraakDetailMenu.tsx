import {ChevronDownIcon} from "@chakra-ui/icons";
import {
	Button,
	HStack,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import Routes from "../../../config/routes";
import {Afspraak} from "../../../generated/graphql";

const AfspraakDetailMenu: React.FC<{afspraak: Afspraak, onDelete: VoidFunction}> = ({afspraak, onDelete}) => {
	const {t} = useTranslation();
	const {isOpen, onOpen, onClose} = useDisclosure();

	const onClickDelete = () => {
		if (!isOpen) {
			onOpen();
		}
		else {
			onDelete();
		}
	};

	return (<>
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t("deleteAfspraak.confirmModalTitle")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Text>{t("deleteAfspraak.confirmModalBody")}</Text>
				</ModalBody>
				<ModalFooter>
					<HStack>
						<Button variant={"ghost"} onClick={onClose}>{t("actions.cancel")}</Button>
						<Button colorScheme={"red"} onClick={onClickDelete}>{t("actions.delete")}</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>
		</Modal>

		<Menu>
			<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} data-cy={"actionsMenuButton"} />
			<MenuList>
				<NavLink to={Routes.EditAfspraak(afspraak.id)}><MenuItem>{t("actions.edit")}</MenuItem></NavLink>
				<MenuItem onClick={onClickDelete}>{t("actions.delete")}</MenuItem>
			</MenuList>
		</Menu>
	</>);
};
export default AfspraakDetailMenu;