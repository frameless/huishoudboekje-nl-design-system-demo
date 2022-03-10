import {Box, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Burger} from "../../../generated/graphql";
import AddBurgerRekeningModal from "../../Rekeningen/AddBurgerRekeningModal";
import RekeningList from "../../Rekeningen/RekeningList";
import AddButton from "../../shared/AddButton";
import Section from "../../shared/Section";
import SectionContainer from "../../shared/SectionContainer";

const BurgerRekeningenView: React.FC<{burger: Burger}> = ({burger}) => {
	const {t} = useTranslation();
	const addRekeningModal = useDisclosure();

	return (<>
		<AddBurgerRekeningModal burger={burger} disclosure={addRekeningModal} />

		<SectionContainer>
			<Section title={t("forms.burgers.sections.rekeningen.title")} helperText={t("forms.burgers.sections.rekeningen.detailText")}>
				<RekeningList rekeningen={burger.rekeningen || []} burger={burger} />
				<Box>
					<AddButton onClick={() => addRekeningModal.onOpen()}>{t("global.actions.add")}</AddButton>
				</Box>
			</Section>
		</SectionContainer>
	</>);
};

export default BurgerRekeningenView;