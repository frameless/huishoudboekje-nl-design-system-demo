import {Button, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Burger, GetHuishoudenDocument, GetHuishoudensDocument, Huishouden, useAddHuishoudenBurgerMutation, useGetBurgersQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {formatBurgerName, humanJoin} from "../../../utils/things";
import useToaster from "../../../utils/useToaster";

const AddBurgerToHuishoudenModal: React.FC<{huishouden: Huishouden, isOpen: boolean, onClose: VoidFunction}> = ({huishouden, isOpen, onClose}) => {
	const {t} = useTranslation();
	const toast = useToaster();
	const [selectedBurgers, setSelectedBurgers] = useState<Burger[]>([]);
	const $burgers = useGetBurgersQuery();
	const [addHuishoudenBurger] = useAddHuishoudenBurgerMutation({
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
				error: t("messages.addHuishoudenBurger.noOptionsSelectedError"),
			});
			return;
		}

		addHuishoudenBurger({
			variables: {
				huishoudenId: huishouden.id!,
				burgerIds: selectedBurgers.map(b => b.id as number),
			},
		}).then(result => {
			toast({
				success: t("messages.addHuishoudenBurger.success", {names: humanJoin(selectedBurgers.map(b => formatBurgerName(b))), count: selectedBurgers.length}),
			});
		}).catch(err => {
			console.error(err);
			toast({
				error: err.message,
			});
		});
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t("forms.huishoudens.addBurger.title")}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack>
						<FormControl>
							<FormLabel>{t("forms.huishoudens.findBurger")}</FormLabel>
							<Queryable query={$burgers} children={data => {
								const burgers: Burger[] = data.burgers || [];

								/* Only show burgers that are not already in this Huishouden yet. */
								const options = burgers
									.filter(b => !huishouden.burgers?.map(hb => hb.id).includes(b.id))
									.map(b => ({key: b.id, value: b.id, label: formatBurgerName(b)}));

								return (
									<Select options={options} isMulti onChange={selectedOptions => {
										const selectedBurgers = burgers.filter(b => selectedOptions.map(so => so.value).includes(b.id));
										setSelectedBurgers(selectedBurgers);
									}} />
								);
							}} />
						</FormControl>
					</Stack>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme={"primary"} onClick={onClickSave}>{t("actions.save")}</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AddBurgerToHuishoudenModal;