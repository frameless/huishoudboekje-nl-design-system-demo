import {AddIcon, ChevronDownIcon} from "@chakra-ui/icons";
import {Box, Button, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {AppRoutes} from "../../config/routes";
import {Afdeling, Postadres, Rekening} from "../../generated/graphql";
import BackButton from "../Layouts/BackButton";
import {FormLeft, FormRight} from "../Layouts/Forms";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";
import PostadresList from "../Postadressen/PostadresList";
import AddAfdelingRekeningModal from "../Rekeningen/AddAfdelingRekeningModal";
import RekeningList from "../Rekeningen/RekeningList";
import AddAfdelingPostadresModal from "./AddAfdelingPostadresModal";
import UpdateAfdelingModal from "./UpdateAfdelingModal";

const AfdelingDetailView: React.FC<{afdeling: Afdeling}> = ({afdeling}) => {
	const organisatieId: number = afdeling.organisatie?.id!;
	const {t} = useTranslation();
	const updateAfdelingModal = useDisclosure();
	const addPostadresModal = useDisclosure();
	const addRekeningModal = useDisclosure();
	const postadressen: Postadres[] = afdeling.postadressen || [];
	const rekeningen: Rekening[] = afdeling.rekeningen || [];

	return (<>
		<UpdateAfdelingModal afdeling={afdeling} disclosure={updateAfdelingModal} />
		<AddAfdelingPostadresModal afdeling={afdeling} disclosure={addPostadresModal} />
		<AddAfdelingRekeningModal afdeling={afdeling} disclosure={addRekeningModal} />

		<Page title={afdeling.naam || t("afdeling")} backButton={<BackButton to={AppRoutes.Organisatie(organisatieId)} />} menu={(
			<Menu>
				<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} />
				<MenuList>
					<MenuItem onClick={() => updateAfdelingModal.onOpen()}>{t("global.actions.edit")}</MenuItem>
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
								<Button leftIcon={<AddIcon />} colorScheme={"primary"} size={"sm"}
									onClick={() => addPostadresModal.onOpen()}>{t("global.actions.add")}</Button>
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
								<Button leftIcon={<AddIcon />} colorScheme={"primary"} size={"sm"}
									onClick={() => addRekeningModal.onOpen()}>{t("global.actions.add")}</Button>
							</Box>
						</Stack>
					</FormRight>
				</Stack>
			</Section>
		</Page>
	</>);
};

export default AfdelingDetailView;