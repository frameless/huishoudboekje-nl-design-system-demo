import {ChevronDownIcon} from "@chakra-ui/icons";
import {Divider, IconButton, Menu, MenuButton, MenuItem, MenuList, Stack, Text, useDisclosure} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Afdeling, Postadres, Rekening} from "../../generated/graphql";
import {FormLeft, FormRight} from "../Layouts/Forms";
import Page from "../Layouts/Page";
import Section from "../Layouts/Section";
import RekeningList from "../Rekeningen/RekeningList";
import DeleteAfdelingModal from "./DeleteAfdelingModal";

const AfdelingListItem: React.FC<{afdeling: Afdeling}> = ({afdeling}) => {
	const {t} = useTranslation();
	const deleteModal = useDisclosure();

	const postadressen: Postadres[] = afdeling.postadressen || [];
	const rekeningen: Rekening[] = afdeling.rekeningen || [];

	return (
		<Page title={afdeling.naam || t("afdeling")} menu={(
			<Menu>
				<IconButton as={MenuButton} icon={<ChevronDownIcon />} variant={"solid"} aria-label={"Open menu"} data-cy={"actionsMenuButton"} />
				<MenuList>
					<MenuItem onClick={() => deleteModal.onOpen()}>{t("global.actions.delete")}</MenuItem>
				</MenuList>
			</Menu>
		)}>
			<DeleteAfdelingModal afdeling={afdeling} disclosure={deleteModal} />

			<Section divider={<Divider />}>
				<Stack direction={["column", "row"]}>
					<FormLeft title={t("departments.addresses")} />
					<FormRight>
						{postadressen.map(p => (
							<Stack key={p.id} spacing={0}>
								<Text>{p.straatnaam} {p.huisnummer}</Text>
								<Text>{p.postcode} {p.plaatsnaam}</Text>
							</Stack>
						))}
					</FormRight>
				</Stack>

				<Stack direction={["column", "row"]}>
					<FormLeft title={t("departments.rekeningen")} />
					<FormRight>
						<RekeningList rekeningen={rekeningen} afdeling={afdeling} />
					</FormRight>
				</Stack>
			</Section>
		</Page>
	);
};

export default AfdelingListItem;