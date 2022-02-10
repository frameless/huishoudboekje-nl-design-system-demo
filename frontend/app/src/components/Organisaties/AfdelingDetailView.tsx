import {ChevronDownIcon} from "@chakra-ui/icons";
import {Box, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {AppRoutes} from "../../config/routes";
import {Afdeling, Postadres, Rekening} from "../../generated/graphql";
import Page from "../shared/Page";
import PostadresList from "../Postadressen/PostadresList";
import AddAfdelingRekeningModal from "../Rekeningen/AddAfdelingRekeningModal";
import RekeningList from "../Rekeningen/RekeningList";
import AddButton from "../shared/AddButton";
import BackButton from "../shared/BackButton";
import {FormLeft, FormRight} from "../shared/Forms";
import Section from "../shared/Section";
import AddAfdelingPostadresModal from "./AddAfdelingPostadresModal";
import DeleteAfdelingModal from "./DeleteAfdelingModal";
import UpdateAfdelingModal from "./UpdateAfdelingModal";

const AfdelingDetailView: React.FC<{afdeling: Afdeling}> = ({afdeling}) => {
	const organisatieId: number = afdeling.organisatie?.id!;
	const {t} = useTranslation();
	const updateAfdelingModal = useDisclosure();
	const deleteAfdelingModal = useDisclosure();
	const addPostadresModal = useDisclosure();
	const addRekeningModal = useDisclosure();
	const postadressen: Postadres[] = afdeling.postadressen || [];
	const rekeningen: Rekening[] = afdeling.rekeningen || [];

	return (<>
		<UpdateAfdelingModal afdeling={afdeling} disclosure={updateAfdelingModal} />
		<DeleteAfdelingModal afdeling={afdeling} disclosure={deleteAfdelingModal} />
		<AddAfdelingPostadresModal afdeling={afdeling} disclosure={addPostadresModal} />
		<AddAfdelingRekeningModal afdeling={afdeling} disclosure={addRekeningModal} />

		<Page title={afdeling.naam || t("afdeling")} backButton={<BackButton to={AppRoutes.Organisatie(organisatieId)} />} menu={(
			<Menu>
				<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} />
				<MenuList>
					<MenuItem onClick={() => updateAfdelingModal.onOpen()}>{t("global.actions.edit")}</MenuItem>
					<MenuItem onClick={() => deleteAfdelingModal.onOpen()}>{t("global.actions.delete")}</MenuItem>
				</MenuList>
			</Menu>
		)}>

			<Section>
				<Stack direction={["column", "row"]}>
					<FormLeft title={t("pages.afdelingDetails.sectionPostadressen.title")} helperText={t("pages.afdelingDetails.sectionPostadressen.helperText")} />
					<FormRight>
						<Stack>
							<Heading size={"md"}>{t("postadressen")}</Heading>
							<PostadresList postadressen={postadressen} afdeling={afdeling} />
							<Box>
								<AddButton onClick={() => addPostadresModal.onOpen()} />
							</Box>
						</Stack>
					</FormRight>
				</Stack>
			</Section>

			<Section>
				<Stack direction={["column", "row"]}>
					<FormLeft title={t("pages.afdelingDetails.sectionRekeningen.title")} helperText={t("pages.afdelingDetails.sectionRekeningen.helperText")} />
					<FormRight>
						<Stack>
							<Heading size={"md"}>{t("rekeningen")}</Heading>
							<RekeningList rekeningen={rekeningen} afdeling={afdeling} />
							<Box>
								<AddButton onClick={() => addRekeningModal.onOpen()} />
							</Box>
						</Stack>
					</FormRight>
				</Stack>
			</Section>
		</Page>
	</>);
};

export default AfdelingDetailView;