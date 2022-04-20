import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {Burger, GetHuishoudenDocument, GetHuishoudensDocument, Huishouden, useAddHuishoudenBurgerMutation, useGetBurgersQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import {formatBurgerName, humanJoin, useReactSelectStyles} from "../../../utils/things";
import useToaster from "../../../utils/useToaster";
import {MultiLineOption, MultiLineValueContainer} from "../../Layouts/ReactSelect/CustomComponents";
import Modal from "../../shared/Modal";
import {Button, FormControl, FormLabel, Stack} from "@chakra-ui/react";

const AddBurgerToHuishoudenModal: React.FC<{ huishouden: Huishouden, isOpen: boolean, onClose: VoidFunction }> = ({huishouden, isOpen, onClose}) => {
    const {t} = useTranslation();
    const toast = useToaster();
    const reactSelectStyles = useReactSelectStyles();
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
                error: t("messages.huishoudenBurger.noOptionsSelectedError"),
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
                success: t("messages.huishoudenBurger.addSuccess", {names: humanJoin(selectedBurgers.map(b => formatBurgerName(b))), count: selectedBurgers.length}),
            });
        }).catch(err => {
            console.error(err);
            toast({
                error: err.message,
            });
        });
    };

    return (
        <Modal
            title={t("forms.huishoudens.addBurger.title")}
            onClose={onClose}
            isOpen={isOpen}
            confirmButton={<Button colorScheme={"primary"} onClick={onClickSave}>{t("global.actions.save")}</Button>}
        >
            <Stack>
                <FormControl isRequired={true}>
                    <FormLabel>{t("forms.huishoudens.findBurger")}</FormLabel>
                    <Queryable query={$burgers} children={data => {
                        const burgers: Burger[] = data.burgers || [];

                        /* Only show burgers that are not already in this Huishouden yet. */
                        const options = burgers
                            .filter(b => !huishouden.burgers?.map(hb => hb.id).includes(b.id))
                            .map(b => ({key: b.id, value: b.id, label: [formatBurgerName(b), `${b.straatnaam} ${b.huisnummer}, ${b.postcode} ${b.plaatsnaam}`]}));

                        return (
                            <Select options={options} isClearable styles={reactSelectStyles.default} onChange={selectedOption => {
                                const selectedBurger: Burger = burgers.find(b => selectedOption?.value === b.id) as Burger;
                                setSelectedBurgers([selectedBurger]);
                            }} components={{Option: MultiLineOption, ValueContainer: MultiLineValueContainer}} />
                        );
                    }} />
                </FormControl>
            </Stack>
        </Modal>
    );
};

export default AddBurgerToHuishoudenModal;