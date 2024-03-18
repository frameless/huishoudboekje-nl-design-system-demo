import {Box, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {AppRoutes} from "../../config/routes";
import {Afdeling, Postadres, Rekening} from "../../generated/graphql";
import PostadresList from "../Postadressen/PostadresList";
import AddAfdelingRekeningModal from "../Rekeningen/AddAfdelingRekeningModal";
import RekeningList from "../Rekeningen/RekeningList";
import AddButton from "../shared/AddButton";
import BackButton from "../shared/BackButton";
import MenuIcon from "../shared/MenuIcon";
import Page from "../shared/Page";
import Section from "../shared/Section";
import SectionContainer from "../shared/SectionContainer";
import AddAfdelingPostadresModal from "./AddAfdelingPostadresModal";
import DeleteAfdelingAlert from "./DeleteAfdelingAlert";
import UpdateAfdelingModal from "./UpdateAfdelingModal";

const AfdelingDetailView: React.FC<{afdeling: Afdeling}> = ({afdeling}) => {
	if (!afdeling?.organisatie?.id) {
		return null;
	}

	const organisatieId: number = afdeling.organisatie.id;
	const {t} = useTranslation();
	const updateAfdelingModal = useDisclosure();
	const deleteAfdelingAlert = useDisclosure();
	const addPostadresModal = useDisclosure();
	const addRekeningModal = useDisclosure();
	const postadressen: Postadres[] = afdeling.postadressen || [];
	const rekeningen: Rekening[] = afdeling.rekeningen || [];

	return (<>
		{updateAfdelingModal.isOpen && <UpdateAfdelingModal afdeling={afdeling} onClose={updateAfdelingModal.onClose} />}
		{deleteAfdelingAlert.isOpen && <DeleteAfdelingAlert afdeling={afdeling} onClose={deleteAfdelingAlert.onClose} />}
		{addPostadresModal.isOpen && <AddAfdelingPostadresModal afdeling={afdeling} onClose={addPostadresModal.onClose} />}
		{addRekeningModal.isOpen && <AddAfdelingRekeningModal afdeling={afdeling} onClose={addRekeningModal.onClose} />}

		<Page title={afdeling.naam || t("afdeling")} backButton={<BackButton to={AppRoutes.Organisatie(String(organisatieId))} />} menu={(
			<Menu>
				<IconButton as={MenuButton} data-test="menuDepartment" icon={<MenuIcon />} variant={"solid"} aria-label={"Open menu"} />
				<MenuList>
					<MenuItem data-test="menuDepartment.edit" onClick={() => updateAfdelingModal.onOpen()}>{t("global.actions.edit")}</MenuItem>
					<MenuItem data-test="menuDepartment.delete" onClick={() => deleteAfdelingAlert.onOpen()}>{t("global.actions.delete")}</MenuItem>
				</MenuList>
			</Menu>
		)}>

			<SectionContainer>
				<Section title={t("pages.afdelingDetails.sectionPostadressen.title")} helperText={t("pages.afdelingDetails.sectionPostadressen.helperText")}>
					<Stack>
						<PostadresList postadressen={postadressen} afdeling={afdeling} />
						<Box>
							<AddButton data-test="button.addPostaddressModal" onClick={() => addPostadresModal.onOpen()} />
						</Box>
					</Stack>
				</Section>

				<Section title={t("pages.afdelingDetails.sectionRekeningen.title")} helperText={t("pages.afdelingDetails.sectionRekeningen.helperText")}>
					<Stack>
						<RekeningList rekeningen={rekeningen} afdeling={afdeling} />
						<Box>
							<AddButton data-test="button.addBankAccountModal" onClick={() => addRekeningModal.onOpen()} />
						</Box>
					</Stack>
				</Section>
			</SectionContainer>
		</Page>
	</>);
};

export default AfdelingDetailView;
