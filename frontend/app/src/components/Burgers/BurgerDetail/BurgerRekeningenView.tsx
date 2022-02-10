import {Box, Stack, StackProps, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Burger} from "../../../generated/graphql";
import {FormLeft, FormRight} from "../../shared/Forms";
import AddBurgerRekeningModal from "../../Rekeningen/AddBurgerRekeningModal";
import RekeningList from "../../Rekeningen/RekeningList";
import AddButton from "../../shared/AddButton";

const BurgerRekeningenView: React.FC<StackProps & {burger: Burger}> = ({burger, ...props}) => {
	const {t} = useTranslation();
	const addRekeningModal = useDisclosure();

	return (<>
		<AddBurgerRekeningModal burger={burger} disclosure={addRekeningModal} />

		<Stack spacing={2} mb={1} direction={["column", "row"]} {...props}>
			<FormLeft title={t("forms.burgers.sections.rekeningen.title")} helperText={t("forms.burgers.sections.rekeningen.detailText")} />
			<FormRight justifyContent={"center"}>
				<RekeningList rekeningen={burger.rekeningen || []} burger={burger} />
				<Box>
					<AddButton onClick={() => addRekeningModal.onOpen()}>{t("global.actions.add")}</AddButton>
				</Box>
			</FormRight>
		</Stack>
	</>);
};

export default BurgerRekeningenView;