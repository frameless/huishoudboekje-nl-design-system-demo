import {Box, Button, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Burger, GetHuishoudenDocument, GetHuishoudensDocument, Huishouden, useDeleteHuishoudenBurgerMutation} from "../../../generated/graphql";
import {formatBurgerName, humanJoin} from "../../../utils/things";
import useToaster from "../../../utils/useToaster";

const DeleteBurgerFromHuishoudenModal: React.FC<{huishouden: Huishouden, isOpen: boolean, onClose: VoidFunction}> = ({huishouden, isOpen, onClose}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const [selectedBurgers, setSelectedBurgers] = useState<Burger[]>([]);
	const [deleteHuishoudenBurger] = useDeleteHuishoudenBurgerMutation({
		refetchQueries: [
			{query: GetHuishoudenDocument, variables: {id: huishouden.id!}},
			{query: GetHuishoudensDocument},
		],
		onCompleted: () => {
			setSelectedBurgers([]);
			onClose();
		},
	});

	const onClickSave = () => {
		if (selectedBurgers && selectedBurgers.length === 0) {
			toast({
				error: t("messages.deleteHuishoudenBurger.noOptionsSelectedError"),
			});
			return;
		}

		deleteHuishoudenBurger({
			variables: {
				huishoudenId: huishouden.id!,
				burgerIds: selectedBurgers.map(b => b.id as number),
			},
		}).then(result => {
			toast({
				success: t("messages.deleteHuishoudenBurger.success", {names: humanJoin(selectedBurgers.map(b => formatBurgerName(b))), count: selectedBurgers.length}),
			});
		}).catch(err => {
			console.error(err);
			toast({
				error: err.message,
			});
		});
	};

	const burgers: Burger[] = huishouden.burgers || [];

	/* Only show burgers that are in this Huishouden. */
	const options = burgers
		.filter(b => huishouden.burgers?.map(hb => hb.id).includes(b.id))
		.map(b => ({key: b.id, value: b.id, label: formatBurgerName(b)}));

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t("forms.huishoudens.deleteBurger.title")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack>
						<FormControl>
							<FormLabel>{t("forms.huishoudens.findBurger")}</FormLabel>
							<Select options={options} isMulti onChange={selectedOptions => {
								const selectedBurgers = burgers.filter(b => selectedOptions.map(so => so.value).includes(b.id));
								setSelectedBurgers(selectedBurgers);
							}} />
						</FormControl>

						<Box>
							<Button colorScheme={"primary"} onClick={onClickSave}>{t("actions.save")}</Button>
						</Box>
					</Stack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default DeleteBurgerFromHuishoudenModal;